const Groq = require('groq-sdk');
const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');

const groqApiKey = process.env.GROQ_API_KEY?.trim();
const hasValidGroqKey =
  Boolean(groqApiKey) &&
  !groqApiKey.includes('<') &&
  !groqApiKey.toLowerCase().includes('replace');

const groq = hasValidGroqKey ? new Groq({ apiKey: groqApiKey }) : null;

exports.sendMessage = async (req, res) => {
  try {
    if (!groq) {
      return res.status(503).json({
        message: 'AI service is not configured correctly. Please update the Groq API key.',
      });
    }

    const { conversationId, message } = req.body;

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (
      conversationId !== undefined &&
      (typeof conversationId !== 'string' || !mongoose.isValidObjectId(conversationId))
    ) {
      return res.status(400).json({ message: 'Invalid conversation ID' });
    }

    const normalizedMessage = message.trim();
    const isNewConversation = !conversationId;
    let conversation;

    if (conversationId) {
      // Find existing conversation
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId: req.user._id,
      });

      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
    } else {
      // Create new conversation
      // Generate title from the first 50 chars of the user's message
      const title =
        normalizedMessage.length > 50
          ? normalizedMessage.substring(0, 50) + '...'
          : normalizedMessage;

      conversation = await Conversation.create({
        userId: req.user._id,
        title,
        messages: [],
      });
    }

    // Add user message to conversation
    conversation.messages.push({ role: 'user', content: normalizedMessage });

    try {
      // Build message history for Groq API
      const messagesForGroq = [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        ...conversation.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ];

      // Call Groq API
      const completion = await groq.chat.completions.create({
        messages: messagesForGroq,
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 1024,
      });

      const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

      // Add AI response to conversation
      conversation.messages.push({ role: 'assistant', content: aiResponse });
      await conversation.save();

      res.json({
        conversationId: conversation._id,
        message: {
          role: 'assistant',
          content: aiResponse,
          _id: conversation.messages[conversation.messages.length - 1]._id,
        },
      });
    } catch (groqError) {
      console.error('Groq API error:', groqError);

      if (isNewConversation) {
        await conversation.deleteOne();
      } else {
        // Keep existing conversations unchanged when the AI request fails.
        conversation.messages.pop();
        await conversation.save();
      }

      // Check for auth-related errors
      const errorMessage = groqError.message || '';
      if (
        errorMessage.includes('API_KEY') ||
        errorMessage.includes('API key') ||
        errorMessage.includes('unauthorized') ||
        errorMessage.includes('forbidden') ||
        errorMessage.includes('401') ||
        errorMessage.includes('403')
      ) {
        return res.status(503).json({
          message: 'AI service is not configured correctly. Please update the Groq API key.',
        });
      }

      if (errorMessage.includes('429') || groqError.status === 429) {
        return res.status(503).json({
          message: 'AI service is temporarily rate-limited. Please try again later.',
        });
      }

      return res.status(502).json({ message: 'AI service unavailable. Please try again later.' });
    }
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user._id })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 });

    res.json({ conversations });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error fetching history' });
  }
};

exports.getConversation = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid conversation ID' });
    }

    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json({ conversation });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Server error fetching conversation' });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid conversation ID' });
    }

    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ message: 'Server error deleting conversation' });
  }
};
