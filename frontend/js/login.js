const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await axios.post(
            "http://localhost:5000/api/auth/login",
            {
                email,
                password
            }
        );

        const data = response.data;

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Login successful");

        window.location.href = "projects.html";

    } catch (error) {

        console.error(error);

        alert(
            error.response?.data?.message || "Login failed"
        );

    }

});