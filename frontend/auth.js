// Restaurer la session depuis le token
async function restoreSession() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return null;
    }
}

// Vérifier si connecté
function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
    }
}

// Déconnexion
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}