function showManage() {
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
