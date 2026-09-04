const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// TON ADMIN AUTORISE LES LANGUES ICI
const LANGS_AUTORISEES = ["pl", "he", "fr", "en"];

app.get('/', (req, res) => {
  res.json({ status: "ZenPay Translation API OK", languages: LANGS_AUTORISEES });
});

app.get('/api/languages', (req, res) => {
  res.json(LANGS_AUTORISEES);
});

app.get('/api/translations/:lang', (req, res) => {
  const lang = req.params.lang.toLowerCase();
  if (!LANGS_AUTORISEES.includes(lang)) {
    return res.status(403).json({ error: "Langue non autorisée par l'admin" });
  }
  const filePath = path.join(__dirname, 'locales', `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Fichier introuvable" });
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  res.json(data);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('API lancée sur', PORT));
