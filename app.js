const API_KEY = 'app-hgPLZZdMkkfJQsHoaos1JtLk';  // Substitua com sua chave da API
const DIFY_API_URL = 'https://api.dify.ai/v1/chat-messages';

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();

    if (messageText !== "") {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Exibe a mensagem do usuário no chat
        appendMessage('user', messageText, currentTime);

        // Limpa o campo de input
        messageInput.value = "";

        // Rola para o final do chat
        scrollToBottom();

        // Verifica se a mensagem é sobre pagamento
        if (messageText.toLowerCase() === "pagamento") {
            const payment_url = "https://tinapagamentos.netlify.app/";
            appendMessage('bot', `Você pode realizar o pagamento através do seguinte link: ${payment_url}`, currentTime);
        } else {
            // Chamar a API Dify
            const response = await sendMessageToAPI(messageText);

            if (response) {
                const botMessage = response.answer || 'Desculpe, não consegui entender sua pergunta.';
                const donationMessage = createDonationMessage(botMessage);
                appendMessage('bot', donationMessage, currentTime);
            } else {
                appendMessage('bot', 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.', currentTime);
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
            user: "12345",  // Esse ID pode ser dinâmico
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
            console.error('Erro na resposta da API');
            return null;
        }
    } catch (error) {
        console.error('Erro ao chamar a API:', error);
        return null;
    }
}

function createDonationMessage(botMessage) {
    return (
        `Por favor ajude a Tina e a empresa Eliobros Tech, fazendo uma pequena doação para manter os trabalhos funcionando. ` +
        `Faça uma doação de pelo menos 10 meticais ou 5 reais pelos seguintes métodos:\n\n` +
        `M-pesa: 841617651\nE-mola: 862840075\nPaypal: habibosalimo0@gmail.com\nPix: eliobrostech3@gmail.com\n\n` +
        `**Sua mensagem abaixo**\n_____________________\n
        ${botMessage}`
    );
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

    document.getElementById('chatBox').appendChild(messageContainer);
}

function scrollToBottom() {
    const chatBox = document.getElementById('chatBox');
    chatBox.scrollTop = chatBox.scrollHeight;
          }
