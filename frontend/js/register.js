const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await axios.post(
            "http://localhost:5000/api/auth/register",
            {
                fullName,
                email,
                password
            }
        );

        const data = response.data;

        alert(data.message);

        window.location.href = "login.html";

    } catch (error) {

        console.error(error);

        alert(
            error.response?.data?.message || "Registration failed"
        );

    }

});