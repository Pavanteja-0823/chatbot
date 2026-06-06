const Groq = require('groq-sdk');
const Conversation = require('../models/Conversation');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

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
        message.length > 50 ? message.substring(0, 50) + '...' : message;

      conversation = await Conversation.create({
        userId: req.user._id,
        title,
        messages: [],
      });
    }

    // Add user message to conversation
    conversation.messages.push({ role: 'user', content: message });

    // Build message history for Groq API
    const messagesForGroq = [
      { role: 'system', content: 'You are a helpful AI assistant.' },
      ...conversation.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    try {
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

      // If Groq API fails, remove the user message we added
      conversation.messages.pop();
      await conversation.save();

      res.status(502).json({ message: 'AI service unavailable. Please try again later.' });
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
