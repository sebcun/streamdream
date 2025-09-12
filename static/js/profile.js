const profileDropdown = document.getElementById("profile-dropdown");

document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/me")
    .then((response) => {
      if (!response.ok) {
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
      if (data["role"] === -1 || data["role"] === 1) {
        const reviewerA = document.createElement("a");
        reviewerA.textContent = "Reviewer";
        reviewerA.href = "/reviewer";
        profileDropdown.appendChild(reviewerA);

        if (data["role"] === 1) {
          const adminA = document.createElement("a");
          adminA.textContent = "Admin";
          adminA.href = "/admin";
          profileDropdown.appendChild(adminA);
        }
      }

      const profileA = document.createElement("a");
      profileA.textContent = "Profile";
      profileA.href = "/profile";
      profileDropdown.appendChild(profileA);

      const logoutA = document.createElement("a");
      logoutA.textContent = "Logout";
      logoutA.href = "/api/logout";
      profileDropdown.appendChild(logoutA);
    });
});
