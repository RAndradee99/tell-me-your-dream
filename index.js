const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const OpenAI = require('openai');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // ← CORRETO para Railway ou local

// Configura OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota da API de interpretação
app.post('/interpret', async (req, res) => {
  const { dream } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Você é um especialista em interpretação de sonhos.' },
        { role: 'user', content: `Interprete esse sonho: ${dream}` }
      ],
    });

    const result = completion.choices[0].message.content;
    res.json({ result });

  } catch (err) {
    console.error('Erro ao interpretar sonho:', err);
    res.status(500).send('Erro ao interpretar sonho.');
  }
});

// Rota fallback para sempre servir index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
