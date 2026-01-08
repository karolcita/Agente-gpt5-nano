const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');

function actualizarInterfaz(texto, remitente) {
    const esIA = remitente === 'ia';
    const burbuja = document.createElement('div');
    burbuja.className = "max-w-3xl mx-auto flex gap-4 animate-in fade-in duration-500";
    
    burbuja.innerHTML = `
        <div class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${esIA ? 'bg-emerald-500' : 'bg-blue-600'}">
            ${esIA ? 'AI' : 'Tú'}
        </div>
        <div class="flex-1">
            <p class="${esIA ? 'text-gray-300' : 'text-white'}">${texto}</p>
        </div>
    `;
    
    chatContainer.appendChild(burbuja);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll hacia abajo
}

// Escuchar la tecla Enter
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensaje();
    }
});