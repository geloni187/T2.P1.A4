const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Guarda na RAM

// Rota de visão: 'file' é o nome do campo que virá do Front-end (FormData)
router.post('/vision', upload.single('file'), chatController.enviarMensagemVision);

module.exports = router;