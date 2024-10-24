const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const USERS_DB_PATH = path.join(__dirname, 'cadastro_DB', 'usuarios.json');

// Middleware para JSON
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Verifica se a pasta cadastro_DB existe, caso contrário, cria
const usersDir = path.join(__dirname, 'cadastro_DB');
if (!fs.existsSync(usersDir)) {
    fs.mkdirSync(usersDir, { recursive: true });
}

// Rota para cadastro
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Preencha todos os campos!' });
    }

    // Criar arquivo se não existir
    if (!fs.existsSync(USERS_DB_PATH)) {
        fs.writeFileSync(USERS_DB_PATH, '[]', 'utf8');
    }

    // Ler usuários existentes
    let users = JSON.parse(fs.readFileSync(USERS_DB_PATH, 'utf8'));

    // Verificar se o email já foi cadastrado
    if (users.find(user => user.email === email)) {
        return res.json({ success: false, message: 'Email já cadastrado!' });
    }

    // Adicionar novo usuário
    users.push({ name, email, password });
    fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2), 'utf8');

    return res.json({ success: true });
});

// Rota para login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Ler usuários existentes
    if (fs.existsSync(USERS_DB_PATH)) {
        let users = JSON.parse(fs.readFileSync(USERS_DB_PATH, 'utf8'));

        // Verificar se o usuário existe e a senha está correta
        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
            return res.json({ success: true });
        }
    }
    
    return res.json({ success: false, message: 'Email ou senha incorretos!' });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
