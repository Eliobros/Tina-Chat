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

    const userData = { name, email, password };

    // Enviar dados de cadastro ao servidor
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Usuário cadastrado com sucesso!');
            window.location.href = "chat.html";
        } else {
            alert('Erro no cadastro: ' + data.message);
        }
    })
    .catch(error => console.error('Erro:', error));
});

// Lógica para Login
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const loginData = { email, password };

    // Enviar dados de login ao servidor
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Login efetuado com sucesso!');
            window.location.href = "chat.html";
        } else {
            alert('Erro no login: ' + data.message);
        }
    })
    .catch(error => console.error('Erro:', error));
});
