const mongoose = require('mongoose');

const MensagemSchema = new mongoose.Schema({
    prompt: String,
    resposta: String,
    data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mensagem', MensagemSchema);