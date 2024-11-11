const API_KEY = 'app-hWyXMuzlYLsodBKfZH5BhXR6';  // Substitua com sua chave da API Dify
const DIFY_API_URL = 'https://api.dify.ai/v1/chat-messages';

let userName = ''; // Variável para armazenar o nome do usuário

document.addEventListener('DOMContentLoaded', carregarMensagens); // Carregar mensagens ao carregar a página

// Função para definir o nome do usuário após login/cadastro
function setUserName(name) {
    userName = name; // Define o nome do usuário
}

// Enviar mensagem
async function sendMessage() {
    const messageInput = document.getElementById('userMessage');
    const messageText = messageInput.value.trim();

    if (messageText !== "") {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Exibe a mensagem do usuário no chat
        appendMessage('user', `${userName}: ${messageText}`, currentTime); // Inclui o nome do usuário

        // Salva a mensagem no sessionStorage
        salvarMensagem('user', `${userName}: ${messageText}`, currentTime);

        // Limpa o campo de input
        messageInput.value = "";

        // Rola para o final do chat
        scrollToBottom();

        // Verifica se a mensagem é sobre pagamento
        if (messageText.toLowerCase() === "pagamento") {
            const payment_url = "https://tinapagamentos.netlify.app/";
            appendMessage('bot', `Assistente Tina: Você pode realizar o pagamento através do seguinte link: ${payment_url}`, currentTime);

            // Salva a resposta no sessionStorage
            salvarMensagem('bot', `Assistente Tina: Você pode realizar o pagamento através do seguinte link: ${payment_url}`, currentTime);
        } else {
            // Chamar a API Dify
            const response = await sendMessageToAPI(messageText);

            if (response) {
                const botMessage = response.answer || 'Desculpe, não consegui entender sua pergunta.';
                appendMessage('bot', `Assistente Tina: ${botMessage}`, currentTime); // Prefixo "Assistente Tina"

                // Salva a resposta no sessionStorage
                salvarMensagem('bot', `Assistente Tina: ${botMessage}`, currentTime);
            } else {
                appendMessage('bot', 'Assistente Tina: Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.', currentTime);

                // Salva a mensagem de erro no sessionStorage
                salvarMensagem('bot', 'Assistente Tina: Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.', currentTime);
            }
        }

        // Rola para o final após a resposta
        scrollToBottom();
    }
}

async function sendMessageToAPI(userMessage) {
    try {
        const data = {
            query: userMessage,
            inputs: {},
            response_mode: "blocking",
            user: `${Date.now()}`,  // ID dinâmico com base no timestamp
            conversation_id: "",
            files: []
        };

        const headers = {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        };

        // Fazer a requisição POST para a API Dify
        const response = await fetch(DIFY_API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Resposta da API:', responseData);
            return responseData;
        } else {
            console.error('Erro na resposta da API:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Erro ao chamar a API:', error);
        alert('Ocorreu um erro ao chamar a API. Tente novamente mais tarde.');
        return null;
    }
}

function appendMessage(sender, messageText, time) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message', sender);

    const messageBubble = document.createElement('div');
    messageBubble.classList.add('message-bubble');
    messageBubble.textContent = messageText;

    const messageTime = document.createElement('span');
    messageTime.classList.add('message-time');
    messageTime.textContent = time;

    messageBubble.appendChild(messageTime);
    messageContainer.appendChild(messageBubble);

    const chatBox = document.getElementById('chatBox');
    if (chatBox) {
        chatBox.appendChild(messageContainer);
    }
}

// Função para salvar uma mensagem no sessionStorage
function salvarMensagem(sender, messageText, time) {
    let mensagens = JSON.parse(sessionStorage.getItem('chat')) || [];

    const novaMensagem = {
        sender: sender,
        message: messageText,
        time: time
    };

    mensagens.push(novaMensagem);
    sessionStorage.setItem('chat', JSON.stringify(mensagens));
}

// Função para carregar mensagens do sessionStorage
function carregarMensagens() {
    const mensagens = JSON.parse(sessionStorage.getItem('chat')) || [];

    mensagens.forEach(mensagem => {
        appendMessage(mensagem.sender, mensagem.message, mensagem.time);
    });
}

function scrollToBottom() {
    const chatBox = document.getElementById('chatBox');
    if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Associar evento ao botão de envio de mensagem
document.getElementById('sendMessage').addEventListener('click', sendMessage);

// Para enviar a mensagem ao pressionar Enter
document.getElementById('userMessage').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});