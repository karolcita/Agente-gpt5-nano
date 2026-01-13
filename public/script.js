// Make.com Webhook API Script
const WEBHOOK_URL = 'https://hook.us1.make.com/14clq2afkodrphofc172du9wkla7vbjj';

// Elementos del DOM
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');

/**
 * Agrega un mensaje al chat
 * @param {string} mensaje - El contenido del mensaje
 * @param {boolean} esUsuario - true si es mensaje del usuario, false si es del AI
 */
function agregarMensaje(mensaje, esUsuario = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'max-w-3xl mx-auto flex gap-4';
    
    const avatar = document.createElement('div');
    avatar.className = `w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${
        esUsuario ? 'bg-blue-500' : 'bg-emerald-500'
    }`;
    avatar.textContent = esUsuario ? 'Tú' : 'AI';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'flex-1 space-y-2';
    
    const textP = document.createElement('p');
    textP.className = 'text-gray-300 whitespace-pre-wrap';
    textP.textContent = mensaje;
    
    contentDiv.appendChild(textP);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * Muestra un indicador de carga mientras espera la respuesta
 */
function mostrarCargando() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-indicator';
    loadingDiv.className = 'max-w-3xl mx-auto flex gap-4';
    loadingDiv.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-emerald-500 flex-shrink-0 flex items-center justify-center text-xs">AI</div>
        <div class="flex-1 space-y-2">
            <p class="text-gray-300 animate-pulse">Escribiendo...</p>
        </div>
    `;
    chatContainer.appendChild(loadingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * Oculta el indicador de carga
 */
function ocultarCargando() {
    const loadingDiv = document.getElementById('loading-indicator');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

/**
 * Envía un prompt al webhook de Make.com
 * @param {string} prompt - El prompt a enviar
 * @returns {Promise<object>} - La respuesta del webhook
 */
async function sendPrompt(prompt) {
    const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: prompt
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    
    // Intentar parsear como JSON, si falla devolver como texto
    try {
        return JSON.parse(data);
    } catch {
        return data;
    }
}

/**
 * Función principal para enviar mensaje desde el chat
 */
async function enviarMensaje() {
    const mensaje = userInput.value.trim();
    
    if (!mensaje) return;
    
    // Limpiar input y mostrar mensaje del usuario
    userInput.value = '';
    agregarMensaje(mensaje, true);
    
    // Mostrar indicador de carga
    mostrarCargando();
    
    try {
        // Enviar al webhook y obtener respuesta
        const respuesta = await sendPrompt(mensaje);
        
        // Ocultar carga y mostrar respuesta
        ocultarCargando();
        
        // Extraer solo el campo "result" y formatear caracteres especiales
        let textoRespuesta = '';
        
        if (typeof respuesta === 'string') {
            textoRespuesta = respuesta;
        } else if (respuesta.result) {
            // Extraer el campo result y formatear saltos de línea
            textoRespuesta = respuesta.result;
        } else if (respuesta.message || respuesta.response || respuesta.text) {
            textoRespuesta = respuesta.message || respuesta.response || respuesta.text;
        } else {
            textoRespuesta = 'No se recibió una respuesta válida.';
        }
        
        // Formatear caracteres especiales de string
        textoRespuesta = textoRespuesta
            .replace(/\\n/g, '\n')      // Convertir \n literal a salto de línea
            .replace(/\\t/g, '\t')      // Convertir \t a tabulación
            .replace(/\\r/g, '')        // Remover \r
            .replace(/\\"/g, '"')       // Convertir \" a comillas
            .replace(/\\\\/g, '\\');    // Convertir \\ a barra
        
        agregarMensaje(textoRespuesta, false);
    } catch (error) {
        ocultarCargando();
        console.error('Error:', error);
        agregarMensaje('Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.', false);
    }
}

// Permitir enviar con Enter (Shift+Enter para nueva línea)
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensaje();
    }
});

// Auto-resize del textarea
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 200) + 'px';
});
