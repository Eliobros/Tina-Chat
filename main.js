// Array para armazenar usuários na memória
let users = [];

// Alternar entre Cadastro e Login
document.getElementById('toggle-link').addEventListener('click', function(event) {
    event.preventDefault();
    
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const formTitle = document.getElementById('form-title');
    const toggleText = document.getElementById('toggle-text');

    if (loginForm.style.display === "none") {
        // Exibir login
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        formTitle.textContent = "Login";
        toggleText.innerHTML = 'Não tem uma conta? <a href="#" id="toggle-link">Cadastrar</a>';
    } else {
        // Exibir cadastro
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        formTitle.textContent = "Cadastro";
        toggleText.innerHTML = 'Já tem uma conta? <a href="#" id="toggle-link">Entrar</a>';
    }
});

// Lógica para Cadastro
document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    // Tente registrar o usuário
    const response = registerUser(name, email, password);
    alert(response.message);

    if (response.success) {
        window.location.href = "chat.html";
    }
});

// Função para registrar usuários
function registerUser(name, email, password) {
    // Verifica se todos os campos foram preenchidos
    if (!name || !email || !password) {
        return { success: false, message: 'Preencha todos os campos!' };
    }

    // Verifica se o email já foi cadastrado
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return { success: false, message: 'Email já cadastrado!' };
    }

    // Adiciona novo usuário ao array
    users.push({ name, email, password });
    return { success: true, message: 'Usuário cadastrado com sucesso!' };
}

// Lógica para Login
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Tente fazer login
    const response = loginUser(email, password);
    alert(response.message);

    if (response.success) {
        window.location.href = "chat.html";
    }
});

// Função para fazer login
function loginUser(email, password) {
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        return { success: true, message: 'Login efetuado com sucesso!' };
    } else {
        return { success: false, message: 'Email ou senha incorretos!' };
    }
    }
