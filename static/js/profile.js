const profileDropdown = document.getElementById("profile-dropdown");

document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/me")
    .then((response) => {
      if (!response.ok) {
        const toggleLoadingA = document.createElement("a");
        toggleLoadingA.textContent = "Toggle Loading Screen";
        toggleLoadingA.onclick = () => {
          toggleLoading();
        };
        toggleLoadingA.style.display = "block";
        profileDropdown.appendChild(toggleLoadingA);

        const a = document.createElement("a");
        a.textContent = "Login with Slack";
        a.href = "/login";
        a.style.display = "block";
        profileDropdown.appendChild(a);
        return;
      }
      return response.json();
    })
    .then((data) => {
      if (!data) return;

      const toggleLoadingA = document.createElement("a");
      toggleLoadingA.textContent = "Toggle Loading Screen";
      toggleLoadingA.onclick = () => {
        toggleLoading();
      };
      toggleLoadingA.style.display = "block";
      profileDropdown.appendChild(toggleLoadingA);

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

function toggleLoading() {
  const current = localStorage.getItem("loading");

  if (current) {
    localStorage.removeItem("loading");
    showToast("You will now see the loading screen.", { color: "success" });
  } else {
    localStorage.setItem("loading", true);
    showToast("You will no longer see the loading screen.", {
      color: "success",
    });
  }
}
