require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// CONEXÃO MONGO (Certifique-se de ter a MONGO_URI no seu .env)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Conectado"))
    .catch(err => console.error("❌ Erro MongoDB:", err));

app.use('/api/chat', chatRoutes);// ... outros imports
const authRoutes = require('./routes/authRoutes');

// ...
app.use('/api/auth', authRoutes); // Rota de login/registro
app.use('/api/chat', chatRoutes); // Rota de chat (protegida pelo middleware)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor em http://localhost:${PORT}`));