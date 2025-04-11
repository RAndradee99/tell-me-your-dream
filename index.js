const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota da API
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

// Fallback: sempre retorna index.html se a rota não for da API
const fs = require('fs');

app.use((req, res, next) => {
  const filePath = path.join(__dirname, 'public', req.path);

  if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
    res.sendFile(filePath);
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});


// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
