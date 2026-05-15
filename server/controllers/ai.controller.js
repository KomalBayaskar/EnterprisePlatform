import { db } from '../data/mockDb.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const getAiHistory = (req, res) => {
  res.json(db.aiUsage);
};

export const getAiUsageChart = (req, res) => {
  const chartData = [
    { day: 'Mon', tokens: 120000, cost: 240 },
    { day: 'Tue', tokens: 150000, cost: 300 },
    { day: 'Wed', tokens: 180000, cost: 360 },
    { day: 'Thu', tokens: 140000, cost: 280 },
    { day: 'Fri', tokens: 210000, cost: 420 },
    { day: 'Sat', tokens: 90000, cost: 180 },
    { day: 'Sun', tokens: Math.floor(Math.random() * 50000) + 80000, cost: 200 },
  ];
  res.json(chartData);
};

export const chatWithAi = async (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_key_here') {
    return res.status(500).json({ 
      message: 'GEMINI_API_KEY is missing. Please add it to your server/.env file and restart the server.' 
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Inject context about the platform into the AI prompt
    const systemContext = `
      You are the Enterprise AI Assistant for a usage monitoring platform. 
      Here is the current platform data you should use to answer questions:
      - Users Database: ${JSON.stringify(db.users)}
      - Analytics Overview: ${JSON.stringify(db.analytics)}
      
      Answer the user's prompt concisely and professionally based on this data. Format using plain text or basic markdown.
    `;

    const fullPrompt = `${systemContext}\n\nUser Prompt: ${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const reply = result.response.text();

    // Log usage
    const newUsage = {
      id: db.aiUsage.length + 1,
      userId: req.user.id,
      prompt: prompt,
      model: 'gemini-2.5-flash',
      tokens: Math.floor(Math.random() * 500) + 100,
      cost: 0.005,
      timestamp: new Date().toISOString()
    };
    
    db.aiUsage.push(newUsage);

    res.json({ reply, usage: newUsage });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ message: 'Failed to generate response from Gemini API.' });
  }
};
