// Efeito no menu da nav bar
document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.querySelector('.menu-icon');
    const navList = document.querySelector('.nav-list');

    menuIcon.addEventListener('click', function () {
        navList.classList.toggle('show'); 
    });

    
    renderWeapons();
});

// Fechar o menu quando clicar fora dele
document.addEventListener('click', function (event) {
    const navList = document.querySelector('.nav-list');
    const isClickInside = navList.contains(event.target) || event.target.matches('.menu-icon');

    if (!isClickInside && navList.classList.contains('show')) {
        navList.classList.remove('show');
    }
});

// Criar usuários
const users = {
    master: { email: "master@exemplo.com", password: "master123", role: "master" },
    operador: { email: "operador@exemplo.com", password: "operador123", role: "operador" }
};

// Validar login
function validateLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === users.master.email && password === users.master.password) {
        localStorage.setItem("userRole", users.master.role);
        window.location.href = "home.html";
    } else if (email === users.operador.email && password === users.operador.password) {
        localStorage.setItem("userRole", users.operador.role);
        window.location.href = "home-operador.html";
    } else {
        alert("E-mail ou senha incorretos.");
    }
}

document.getElementById("loginForm")?.addEventListener("submit", validateLogin);

function checkPermissions() {
    const userRole = localStorage.getItem("userRole");
    const currentPage = window.location.pathname.split("/").pop();

    console.log("User Role:", userRole); 
    console.log("Current Page:", currentPage); 

    // Definir página de login
    const loginPage = "index.html";

    // Poginas permitidas para cada função
    const pagesByRole = {
        master: ["home.html", "dash.html", "arsenal.html", "veiculos.html", "secret.html", "index.html"],
        operador: ["home-operador.html", "dash.html", "veiculos.html", "index.html"],
    };

    if (!userRole) {
        if (currentPage !== loginPage) {
            window.location.href = loginPage;
        }
    } else {
        const allowedPages = pagesByRole[userRole];

        if (!allowedPages.includes(currentPage)) {
            alert("Você não tem permissão para acessar esta página.");
            const redirectPage = userRole === "master" ? "home.html" : "home-operador.html";
            window.location.href = redirectPage;
        } else {
            adjustUIBasedOnRole(); 
        }
    }
}

function adjustUIBasedOnRole() {
    const userRole = localStorage.getItem("userRole");

    if (userRole === "operador") {
        // Ocultar elementos exclusivos do usuarioo master
        document.querySelectorAll(".master-only").forEach(el => el.style.display = "none");
    }
}

document.addEventListener("DOMContentLoaded", checkPermissions);

// Adm armas
let weapons = [];

// carregar lista de armas
function renderWeapons() {
    const weaponList = document.getElementById("weapon-list");
    if (weaponList) {
        weaponList.innerHTML = weapons.map((weapon, index) => `
            <div class="weapon-item card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${weapon.name}</h5>
                    <p class="card-text">Munição: ${weapon.ammoType}</p>
                    <p class="card-text">Integridade: ${weapon.status}</p>
                    <button class="btn btn-warning" onclick="updateWeapon(${index})">Atualizar</button>
                    <button class="btn btn-danger" onclick="removeWeapon(${index})">Remover</button>
                </div>
            </div>
        `).join('');
    }
}

// Adicionar nova arma
function addWeapon() {
    const weaponName = document.getElementById("weaponName").value;
    const ammoType = document.getElementById("ammoType").value;
    const status = document.getElementById("status").value;

    if (weaponName && ammoType && status) {
        weapons.push({ name: weaponName, ammoType, status });
        renderWeapons();
        document.getElementById("weaponName").value = "";
        document.getElementById("ammoType").value = "";
        document.getElementById("status").value = "";
    } else {
        alert("Preencha todos os campos!");
    }
}

// Atualizar arma
function updateWeapon(index) {
    const weaponName = prompt("Novo nome da arma:", weapons[index].name);
    const ammoType = prompt("Novo tipo de munição:", weapons[index].ammoType);
    const status = prompt("Novo status de integridade:", weapons[index].status);

    if (weaponName && ammoType && status) {
        weapons[index] = { name: weaponName, ammoType, status };
        renderWeapons();
    } else {
        alert("Todos os campos devem ser preenchidos!");
    }
}

// Excluir arma
function removeWeapon(index) {
    weapons.splice(index, 1);
    renderWeapons();
}
