// 1. Carrega as variáveis do arquivo .env
require('dotenv').config();

// 2. Importa a biblioteca da IA do Google
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 3. Pega a chave que está no seu arquivo .env
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ ERRO: Chave não encontrada! Verifique o arquivo .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function executarAgente() {
    try {
        console.log("⏳ O Agente está despertando...");

        // Seleciona o modelo da IA
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // --- 🧪 SEU DESAFIO DE PERSONA E PROMPT AQUI ---
        // Se quiser mudar o personagem, mude o que está dentro das aspas abaixo
        const persona = "o Mestre Yoda"; 
        const tema = "o que é um Banco de Dados";

        const prompt = `Aja como ${persona}. Explique ${tema} de forma curta e sábia.`;
        // ----------------------------------------------

        const result = await model.generateContent(prompt);
        const resposta = result.response.text();

        console.log("\n🤖 [AGENTE IA]:");
        console.log(resposta);
        console.log("\n✅ Missão concluída com sucesso!");

    } catch (erro) {
        console.error("❌ Erro ao conectar:", erro.message);
    }
}

// Inicia a execução
executarAgente();