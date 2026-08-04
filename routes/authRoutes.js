const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para Cadastro de novo usuário
// URL: POST /api/auth/register
router.post('/register', authController.registrar);

// Rota para Login de usuário existente
// URL: POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;