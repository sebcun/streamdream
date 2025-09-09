const profileDropdown = document.getElementById("profile-dropdown");

document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/me")
    .then((response) => {
      if (!response.ok) {
        console.log("not");
        const a = document.createElement("a");
        a.textContent = "Login with Slack";
        a.href = "/login";
        profileDropdown.appendChild(a);
        return;
      }
      return response.json();
    })
    .then((data) => {
      if (!data) return;
      const logoutA = document.createElement("a");
      logoutA.textContent = "Logout";
      logoutA.href = "/api/logout";
      profileDropdown.appendChild(logoutA);
    });
});
