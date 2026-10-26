import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { travelAgentApp } from './agent/travelGraph.js';
import { readJson } from './utils/db.js';



const app = express();
app.use(cors());
app.use(express.json());

// API route to send messages to the LangGraph Agent
app.post('/api/chat', async (req, res) => {
  try {
    const { history } = req.body; 
    // Convert incoming history array into LangChain BaseMessages
    const formattedMessages = history.map(msg => 
      msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
    );

    const result = await travelAgentApp.invoke({ messages: formattedMessages });
    const lastMessage = result.messages[result.messages.length - 1];

    res.json({ reply: lastMessage.content });
  } catch (error) {
    console.error('Agent error:', error);
    res.status(500).json({ error: 'Failed to process request with AI agent.' });
  }
});

// Admin / User API routes for bookings and catalog data
app.get('/api/plans', async (req, res) => {
  res.json(await readJson('plans.json'));
});

app.get('/api/hotels', async (req, res) => {
  res.json(await readJson('hotels.json'));
});

app.get('/api/bookings', async (req, res) => {
  res.json(await readJson('bookings.json'));
});

// Get all bookings (Admin route)
app.get('/api/admin/bookings', async (req, res) => {
  try {
    // Assuming your bookings are stored in backend/data/bookings.json
    const bookings = await readJson('bookings.json'); 
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});