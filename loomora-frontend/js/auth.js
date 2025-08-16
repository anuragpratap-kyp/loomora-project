// Handle login form
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await apiAuth("/api/auth/login", { email, password });
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        location.href = "index.html";
      } else {
        alert(res.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  });
}

// Handle register form
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await apiAuth("/api/auth/register", { name, email, password });
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        location.href = "index.html";
      } else {
        alert(res.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  });
}
