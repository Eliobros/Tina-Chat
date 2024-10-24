const fs = require('fs');
const path = require('path');

const USERS_DB_PATH = path.join(__dirname, 'usuarios.json');

// Exemplo de dados a serem adicionados
const newUser = { name: 'João', email: 'joao@example.com', password: 'senha123' };

// Ler usuários existentes
let users = [];
if (fs.existsSync(USERS_DB_PATH)) {
    users = JSON.parse(fs.readFileSync(USERS_DB_PATH, 'utf8'));
}

// Adicionar novo usuário
users.push(newUser);

// Escrever de volta no arquivo JSON
fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2), 'utf8');
