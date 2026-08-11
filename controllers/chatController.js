const { GoogleGenerativeAI } = require("@google/generative-ai");
const Mensagem = require("../models/Mensagem");
const cloudinary = require('cloudinary').v2;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configuração do Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.enviarMensagemVision = async (req, res) => {
    try {
        const { prompt } = req.body;
        const arquivo = req.file; // Arquivo enviado pelo Multer

        if (!arquivo) {
            return res.status(400).json({ error: "Por favor, envie uma imagem." });
        }

        // 1. Upload para o Cloudinary via Stream (Memória RAM)
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: "olho-de-rapina" }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
            stream.end(arquivo.buffer);
        });

        // 2. Preparar Gemini 1.5 Flash (Multimodal)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-lite" });

        // Converter buffer da imagem para Base64 para o Gemini
        const imagemBase64 = {
            inlineData: {
                data: arquivo.buffer.toString("base64"),
                mimeType: arquivo.mimetype
            }
        };

        // 3. Gerar resposta da IA (Texto + Imagem)
        const result = await model.generateContent([prompt, imagemBase64]);
        const respostaTexto = result.response.text();

        // 4. Salvar no MongoDB (incluindo a URL da imagem)
        const novaMensagem = new Mensagem({ 
            prompt, 
            resposta: respostaTexto,
            imageUrl: uploadResult.secure_url // URL permanente do Cloudinary
        });
        await novaMensagem.save();

        // 5. Retornar para o Front-end
        res.json({ 
            text: respostaTexto, 
            imageUrl: uploadResult.secure_url 
        });

    } catch (erro) {
        console.error("Erro na Visão:", erro);
        res.status(500).json({ error: "Erro ao processar imagem pela IA" });
    }
};