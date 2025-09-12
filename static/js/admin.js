document.addEventListener("DOMContentLoaded", () => {
  const adminOrdersContainer = document.getElementById("adminOrdersContainer");
  const adminActionsContainer = document.getElementById(
    "adminActionsContainer"
  );

  const faqCard = document.createElement("div");
  faqCard.classList.add("card");
  faqCard.onclick = () => createNewFAQ();
  faqCard.innerHTML = `<h2>Create a new FAQ</h2>`;
  adminActionsContainer.appendChild(faqCard);

  const ruleCard = document.createElement("div");
  ruleCard.classList.add("card");
  ruleCard.onclick = () => createNewRule();
  ruleCard.innerHTML = `<h2>Create a new Rule</h2>`;
  adminActionsContainer.appendChild(ruleCard);

  const rewardCard = document.createElement("div");
  rewardCard.classList.add("card");
  rewardCard.onclick = () => createNewReward();
  rewardCard.innerHTML = `<h2>Create a new Reward</h2>`;
  adminActionsContainer.appendChild(rewardCard);

  const reviewerManageCard = document.createElement("div");
  reviewerManageCard.classList.add("card");
  reviewerManageCard.onclick = () => manageReviewers();
  reviewerManageCard.innerHTML = `<h2>Manage Reviewers</h2>`;
  adminActionsContainer.appendChild(reviewerManageCard);
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

function manageReviewers() {
  openModalHTML(
    "Manage Reviewers",
    `
      <form id="manageReviewersForm" class="submit-form">
        <label for="slackID">Slack user ID:</label>
        <input type="text" id="slackID" name="slackID" required>

        <div style="display: flex; flex-direction: row; gap: 10px; margin-top: 10px;">
          <button type="submit" name="action" value="grant" class="button">Grant</button>
          <button type="submit" name="action" value="revoke" class="button">Revoke</button>
          <button type="button" class="button" onclick="closeModal()">Cancel</button>
        </div>
      </form>
    `
  );
  document
    .getElementById("manageReviewersForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      const action = e.submitter.value;
      if (action === "grant") {
        data.reviewerStatus = -1;
      } else {
        data.reviewerStatus = 0;
      }

      fetch(`/api/reviewer/${data.slackID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => {
          return response.json();
        })
        .then((dataR) => {
          if (dataR["error"]) {
            showToast(dataR["error"], { color: "error" });
            return;
          }
          if (data.reviewerStatus === -1) {
            showToast("Granted reviewer access!", { color: "success" });
            closeModal();
          } else {
            showToast("Revoked reviewer access.", { color: "success" });
            closeModal();
          }
        });
    });
}
