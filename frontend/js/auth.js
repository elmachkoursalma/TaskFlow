// Fonction pour restaurer la session
async function restoreSession() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const res = await axios.get("/api/auth/me", {
            headers: { Authorization: Bearer ${token} }
        });
        return res.data;
    } catch (error) {
        localStorage.removeItem("token");
        return null;
    }
}

function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}