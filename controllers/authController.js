const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// --- FUNÇÃO DE CADASTRO (REGISTER) ---
exports.registrar = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // 1. Verifica se o usuário já existe
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({ msg: "Este e-mail já está cadastrado." });
        }

        // 2. Cria o novo usuário 
        // (A senha será criptografada automaticamente pelo Mongoose Model que criamos antes)
        usuario = new Usuario({ nome, email, senha });

        // 3. Salva no MongoDB
        await usuario.save();

        res.status(201).json({ msg: "Usuário criado com sucesso! Pode fazer login." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Erro ao registrar usuário no servidor." });
    }
};

// --- FUNÇÃO DE LOGIN ---
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // 1. Procura o usuário pelo e-mail
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: "E-mail ou senha incorretos." });
        }

        // 2. Compara a senha digitada com a senha criptografada no banco
        const senhaOk = await bcrypt.compare(senha, usuario.senha);
        if (!senhaOk) {
            return res.status(400).json({ msg: "E-mail ou senha incorretos." });
        }

        // 3. Se tudo estiver OK, gera o Token JWT (O "Crachá Digital")
        // O token contém o ID e o Nome do usuário
        const token = jwt.sign(
            { id: usuario._id, nome: usuario.nome },
            process.env.JWT_SECRET, // Usa a chave secreta do seu .env
            { expiresIn: '1d' }    // O crachá vale por 1 dia
        );

        // 4. Retorna o Token e o Nome para o Front-end
        res.json({
            token,
            nome: usuario.nome
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Erro ao fazer login no servidor." });
    }
};