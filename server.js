
require('dotenv').config(); // <-- MOVIDO AL PRINCIPIO: Carga las variables antes que nada
const express = require('express');
const { OpenAI } = require('openai');

const app = express();
app.use(express.json());
app.use(express.static('public')); 

// Verificación de seguridad en la consola
if (!process.env.OPENAI_API_KEY) {
    console.error("❌ ERROR: No se encontró la API Key en el archivo .env");
} else {
    console.log("✅ API Key detectada correctamente");
}

const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY 
});

app.post('/chat', async (req, res) => {
    try {
        const completion = await openai.chat.completions.create({
            // Aquí definimos el modelo específico. 
            // Si GPT-5 Nano aún no aparece en tu consola, usa "gpt-4o-mini" temporalmente 
            // que es el equivalente actual en eficiencia.
            model: "gpt-5-nano", 
            messages: req.body.messages,
            temperature: 0.7, // Ajuste para que sea creativo pero coherente
        });
        res.json(completion.choices[0].message);
    } catch (error) {
        console.error("Error API:", error.message);
        res.status(500).json({ error: "Fallo en la conexión con GPT-5 Nano" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});