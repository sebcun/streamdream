const profileDropdown = document.getElementById("profile-dropdown");

document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/me")
    .then((response) => {
      if (!response.ok) {
        const a = document.createElement("a");
        a.textContent = "Login with Slack";
        a.href = "/login";
        a.style.display = "block"; // Ensure it's on its own line
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
        reviewerA.style.display = "block";
        profileDropdown.appendChild(reviewerA);

        if (data["role"] === 1) {
          const adminA = document.createElement("a");
          adminA.textContent = "Admin";
          adminA.href = "/admin";
          adminA.style.display = "block";
          profileDropdown.appendChild(adminA);
        }
      }

      const profileA = document.createElement("a");
      profileA.textContent = "Profile";
      profileA.href = "/profile";
      profileA.style.display = "block";
      profileDropdown.appendChild(profileA);

      const balanceText = document.createElement("span");
      balanceText.innerHTML = `<strong>Balance:</strong> ${data["balance"]}h`;
      balanceText.style.display = "block";
      profileDropdown.appendChild(balanceText);

      const logoutA = document.createElement("a");
      logoutA.textContent = "Logout";
      logoutA.href = "/api/logout";
      logoutA.style.display = "block";
      profileDropdown.appendChild(logoutA);
    });
});
