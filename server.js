// server.js
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/14clq2afkodrphofc172du9wkla7vbjj';

app.post('/chat', async (req, res) => {
    try {
        // Obtenemos el último mensaje del usuario
        const ultimoMensaje = req.body.messages[req.body.messages.length - 1].content;

        // Enviamos la petición a Make tal como el CURL
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST', // Cambiamos a POST para enviar el body con el prompt
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "prompt": ultimoMensaje
            })
        });

        const textoRespuesta = await response.text();
        
        // Respondemos al frontend con el formato que espera (rol y contenido)
        res.json({
            role: "assistant",
            content: textoRespuesta || "Webhook procesado (sin respuesta de texto)"
        });

    } catch (error) {
        console.error("Error en Webhook:", error);
        res.status(500).json({ role: "assistant", content: "Error al conectar con el Webhook de Make." });
    }
});

app.listen(3000, () => console.log('🚀 Agente conectado a Make en http://localhost:3000'));