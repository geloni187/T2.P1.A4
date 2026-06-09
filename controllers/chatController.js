const { GoogleGenerativeAI } = require("@google/generative-ai");
const Mensagem = require("../models/Mensagem");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.enviarMensagem = async (req, res) => {
    try {
        const { prompt } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const instrucao = `Aja como o Mestre Yoda. Use Markdown para formatar a resposta. Responda à pergunta: ${prompt}`;
        const result = await model.generateContent(instrucao);
        const respostaTexto = result.response.text();

        // Salva no MongoDB
        const novaMensagem = new Mensagem({ prompt, resposta: respostaTexto });
        await novaMensagem.save();

        res.json({ text: respostaTexto });
    } catch (erro) {
        res.status(500).json({ error: "Erro na IA" });
    }
};

exports.limparHistorico = async (req, res) => {
    try {
        await Mensagem.deleteMany({});
        res.json({ message: "Histórico limpo!" });
    } catch (erro) {
        res.status(500).json({ error: "Erro ao limpar" });
    }
};