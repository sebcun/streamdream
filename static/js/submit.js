const submitStartBtn = document.getElementById("submit-start-btn");

document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/me")
    .then((response) => {
      if (!response.ok) {
        submitStartBtn.textContent = "Login with Slack";
        submitStartBtn.onclick = function () {
          window.location = "/login";
        };
        return;
      }
      return response.json();
    })
    .then((data) => {
      if (!data) return;
    });
});

function openSubmitChecklist() {
  openModalHTML(
    "Are you ready to submit?",
    `
    <ul style="list-style: none; padding: 0;" class="submit-checklist">
      <li>
        <input type="checkbox" id="review" onchange="checkAll()">
        <label for="review">I have reviewed my submission</label>
      </li>
      <li>
        <input type="checkbox" id="rules" onchange="checkAll()">
        <label for="rules">My submission follows all the rules</label>
      </li>
      <li>
        <input type="checkbox" id="demo" onchange="checkAll()">
        <label for="demo">My submission contains a working demo</label>
      </li>
      <li>
        <input type="checkbox" id="readme" onchange="checkAll()">
        <label for="readme">My submission contains a readme</label>
      </li>
      <li>
        <input type="checkbox" id="changes" onchange="checkAll()">
        <label for="changes">I understand that once my project is submitted, any changes made to it after are not counted towards the time tracked and cannot be used to claim rewards</label>
      </li>
    </ul>
    <button class="button" onclick="openSubmitModal()" disabled id="submitBtn">Yes, I'm ready!</button>
    <button class="button" onclick="closeModal()" style="margin-left:20px">Nevermind</button>
    `
  );
}

function openSubmitModal() {
  document.getElementById("submitBtn").disabled = true;
  document.getElementById("submitBtn").textContent = "Loading...";
  fetch("/api/hackatime")
    .then((response) => {
      if (!response.ok) {
        submitStartBtn.textContent = "Login with Slack";
        submitStartBtn.onclick = function () {
          window.location = "/login";
        };
        return;
      }
      return response.json();
    })
    .then((data) => {
      if (!data) return;

      openModalHTML(
        "Submit Project",
        `
          <form id="submitForm" class="submit-form">
            <label for="projectName">Project Name:</label>
            <input type="text" id="projectName" name="projectName" required>

            <label for="projectDescription">Project Description:</label>
            <textarea id="projectDescription" name="projectDescription" required></textarea>

            <label for="hackatimeProject">Hackatime Project:</label>
            <select id="hackatimeProject" name="hackatimeProject" required>
              <option value="">Select an option</option>
            </select>

            <label for="demoLink">Demo Link:</label>
            <input type="url" id="demoLink" name="demoLink" required>
            
            <label for="githubLink">Github Link:</label>
            <input type="url" id="githubLink" name="githubLink" required>
            
            <button type="submit" class="button">Submit</button>
          </form>
        `
      );

      const selectHackatimeMenu = document.getElementById("hackatimeProject");
      data.data["projects"].forEach((project) => {
        const option = document.createElement("option");
        option.value = project.name;
        option.textContent = `${project.name} (${project.text})`;
        option.setAttribute("data-time", project.text || "0m");

        selectHackatimeMenu.appendChild(option);
      });

      document
        .getElementById("submitForm")
        .addEventListener("submit", function (e) {
          e.preventDefault();

          const formData = new FormData(this);
          const data = Object.fromEntries(formData);

          const selectedOption =
            selectHackatimeMenu.options[selectHackatimeMenu.selectedIndex];
          data.hackatimeTime = selectedOption.getAttribute("data-time");

          fetch("/api/submitproject", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
            .then((response) => {
              if (response.ok) {
                showToast(
                  "Project has been submitted for review! Check it out on your profile page.",
                  {
                    color: "success",
                  }
                );
                closeModal();
              } else {
                return response.json().then((errorData) => {
                  showToast(errorData.error || "Error submitting project.", {
                    color: "error",
                  });
                });
              }
            })
            .catch((error) => {
              console.error("Submission error:", error);
              showToast("Network error. Please try again.", { color: "error" });
            });
        });
    });
}

function checkAll() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const allChecked = Array.from(checkboxes).every((cb) => cb.checked);
  document.getElementById("submitBtn").disabled = !allChecked;
}
