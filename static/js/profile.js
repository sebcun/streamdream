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
          const manageA = document.createElement("a");
          manageA.textContent = "Manage";
          manageA.href = "";
          manageA.onclick = function (e) {
            e.preventDefault();
            showManage();
          };
          profileDropdown.appendChild(manageA);

          const faqCard = document.createElement("div");
          faqCard.classList.add("card");
          faqCard.onclick = () => createNewFAQ();
          faqCard.innerHTML = `<h2>Create a new FAQ</h2>`;
          document.getElementById("faqContainer").appendChild(faqCard);

          const ruleCard = document.createElement("div");
          ruleCard.classList.add("card");
          ruleCard.onclick = () => createNewRule();
          ruleCard.innerHTML = `<h2>Create a new Rule</h2>`;
          document.getElementById("rulesContainer").appendChild(ruleCard);

          const rewardCard = document.createElement("div");
          rewardCard.classList.add("card");
          rewardCard.onclick = () => createNewReward();
          rewardCard.innerHTML = `<h2>Create a new Reward</h2>`;
          document.getElementById("rewardContainer").appendChild(rewardCard);
        }
      }
      const logoutA = document.createElement("a");
      logoutA.textContent = "Logout";
      logoutA.href = "/api/logout";
      profileDropdown.appendChild(logoutA);
    });
});

function createNewFAQ() {
  openModalHTML(
    "Create a new FAQ",
    `
      <form id="newFAQForm" class="submit-form">
        <label for="faqTitle">FAQ Title:</label>
        <input type="text" id="faqTitle" name="faqTitle" required>

        <label for="faqDescription">FAQ Description:</label>
        <textarea id="faqDescription" name="faqDescription" required></textarea>

        <div style="display: flex; flex-direction: row; gap: 10px; margin-top: 10px;">
          <button type="submit" class="button">Create</button>
          <button type="button" class="button" onclick="closeModal()">Cancel</button>
        </div>
      </form>
    `
  );

  document
    .getElementById("newFAQForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      fetch(`/api/createfaq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          showToast("FAQ created!", { color: "success" });
          closeModal();
        })
        .catch((error) => {
          console.error("Approval error:", error);
          showToast("Network error. Please try again.", { color: "error" });
        });
    });
}

function createNewRule() {
  openModalHTML(
    "Create a new Rule",
    `
      <form id="newRuleForm" class="submit-form">
        <label for="ruleTitle">Rule Title:</label>
        <input type="text" id="ruleTitle" name="ruleTitle" required>

        <label for="ruleDescription">Rule Description:</label>
        <textarea id="ruleDescription" name="ruleDescription" required></textarea>

        <div style="display: flex; flex-direction: row; gap: 10px; margin-top: 10px;">
          <button type="submit" class="button">Create</button>
          <button type="button" class="button" onclick="closeModal()">Cancel</button>
        </div>
      </form>
    `
  );

  document
    .getElementById("newRuleForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      fetch(`/api/createrule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          showToast("Rule created!", { color: "success" });
          closeModal();
        })
        .catch((error) => {
          console.error("Approval error:", error);
          showToast("Network error. Please try again.", { color: "error" });
        });
    });
}

function createNewReward() {
  openModalHTML(
    "Create a new Reward",
    `
      <form id="newRewardForm" class="submit-form">
        <label for="rewardTitle">Reward Title:</label>
        <input type="text" id="rewardTitle" name="rewardTitle" required>

        <label for="rewardDescription">Reward Description:</label>
        <textarea id="rewardDescription" name="rewardDescription" required></textarea>

        <label for="rewardTime">Reward Price:</label>
        <input type="number" id="rewardTime" name="rewardTime" required></textarea>

        <div style="display: flex; flex-direction: row; gap: 10px; margin-top: 10px;">
          <button type="submit" class="button">Create</button>
          <button type="button" class="button" onclick="closeModal()">Cancel</button>
        </div>
      </form>
    `
  );

  document
    .getElementById("newRewardForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      fetch(`/api/createreward`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          showToast("Reward created!", { color: "success" });
          closeModal();
        })
        .catch((error) => {
          console.error("Approval error:", error);
          showToast("Network error. Please try again.", { color: "error" });
        });
    });
}
