// 1. Ajouter automatiquement le token aux requêtes Axios si l'utilisateur est connecté
const token = localStorage.getItem("token");

if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// 2. Vérifier si l'utilisateur est connecté
function checkAuth() {

    if (!localStorage.getItem("token")) {
        window.location.href = "login.html";
    }

}

// 3. Gérer la déconnexion
function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";

}