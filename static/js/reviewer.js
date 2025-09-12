const toReviewContainer = document.getElementById("toReviewContainer");
const approvedContainer = document.getElementById("approvedContainer");
const deniedContainer = document.getElementById("deniedContainer");

loadProjects();

function loadProjects() {
  toReviewContainer.innerHTML = "";
  approvedContainer.innerHTML = "";
  deniedContainer.innerHTML = "";

  fetch("/api/projects")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response error");
      }
      return response.json();
    })
    .then((projectData) => {
      toReview = projectData.filter((project) => project.approved === 0);
      if (toReview.length == 0) {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
                <h2>No Projects in Review Queue</h2>
                <p></p>
              `;

        toReviewContainer.appendChild(card);
      }

      approved = projectData.filter((project) => project.approved === 1);
      if (approved.length == 0) {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
                <h2>No Projects have been Approved</h2>
                <p></p>
              `;

        approvedContainer.appendChild(card);
      }

      denied = projectData.filter((project) => project.approved === -1);
      if (denied.length == 0) {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
                <h2>No Projects have been Denied</h2>
                <p></p>
              `;

        deniedContainer.appendChild(card);
      }

      toReview.forEach((project) => {
        fetch(`/api/user/${project.author}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response error");
            }
            return response.json();
          })
          .then((data) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.onclick = () => {
              openModalHTML(
                project.title,
                `
              <span><i class="bi bi-stopwatch-fill"></i> ${project.hackatime_time} <i class="bi bi-person-fill" style="margin-left:10px"></i> <a href="https://hackclub.slack.com/team/${project.author}" target="_blank">@${data.name}</a></span>
              <p>${project.description}</p>
              <button class="button" onclick="window.open('${project.demo_link}', '_blank');">Demo <i class="bi bi-box-arrow-up-right"></i></button>
              <button class="button" onclick="window.open('${project.github_link}', '_blank');" style="margin-left:10px">Github <i class="bi bi-box-arrow-up-right"></i></button>
              <button class="button" onclick="approveProject(${project.id});" style="margin-left:10px">Approve</button>
              <button class="button" onclick="confirmDenyProject(${project.id}, '${project.title}');" style="margin-left:10px">Deny</button>
              <button class="button" onclick="closeModal()" style="margin-left:10px; margin-top: 10px">Close</button>
            `
              );
            };

            const displayTitle =
              project.title.length > 75
                ? project.title.slice(0, 75) + "..."
                : project.title;

            const displayDescription =
              project.description.length > 30
                ? project.description.slice(0, 30) + "..."
                : project.description;

            card.innerHTML = `
            <h2>${displayTitle}</h2>
            <p>${displayDescription}</p>`;

            toReviewContainer.appendChild(card);
          });
      });

      approved.forEach((project) => {
        fetch(`/api/user/${project.author}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response error");
            }
            return response.json();
          })
          .then((data) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.onclick = () => {
              console.log(project);
              openModalHTML(
                project.title,
                `
              <span><i class="bi bi-stopwatch-fill"></i> ${project.hackatime_time} <i class="bi bi-person-fill" style="margin-left:10px"></i> <a href="https://hackclub.slack.com/team/${project.author}" target="_blank">@${data.name}</a></span>
              <p>${project.description}</p>
              <small>Approved By: @${project.reviewer}</small><br>
              <button class="button" onclick="window.open('${project.demo_link}', '_blank');">Demo <i class="bi bi-box-arrow-up-right"></i></button>
              <button class="button" onclick="window.open('${project.github_link}', '_blank');" style="margin-left:10px">Github <i class="bi bi-box-arrow-up-right"></i></button>
              <button class="button" onclick="closeModal()" style="margin-left:10px; margin-top: 10px">Close</button>
            `
              );
            };

            const displayTitle =
              project.title.length > 75
                ? project.title.slice(0, 75) + "..."
                : project.title;

            const displayDescription =
              project.description.length > 30
                ? project.description.slice(0, 30) + "..."
                : project.description;

            card.innerHTML = `
            <h2>${displayTitle}</h2>
            <p>${displayDescription}</p>`;

            approvedContainer.appendChild(card);
          });
      });

      denied.forEach((project) => {
        fetch(`/api/user/${project.author}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response error");
            }
            return response.json();
          })
          .then((data) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.onclick = () => {
              openModalHTML(
                project.title,
                `
              <span><i class="bi bi-stopwatch-fill"></i> ${project.hackatime_time} <i class="bi bi-person-fill" style="margin-left:10px"></i> <a href="https://hackclub.slack.com/team/${project.author}" target="_blank">@${data.name}</a></span>
              <p>${project.description}</p>
              <small>Denied By: @${project.reviewer} for "${project.deny_message}"</small><br>
              <button class="button" onclick="window.open('${project.demo_link}', '_blank');">Demo <i class="bi bi-box-arrow-up-right"></i></button>
              <button class="button" onclick="window.open('${project.github_link}', '_blank');" style="margin-left:10px">Github <i class="bi bi-box-arrow-up-right"></i></button>
              <button class="button" onclick="closeModal()" style="margin-left:10px; margin-top: 10px">Close</button>
            `
              );
            };

            const displayTitle =
              project.title.length > 75
                ? project.title.slice(0, 75) + "..."
                : project.title;

            const displayDescription =
              project.description.length > 30
                ? project.description.slice(0, 30) + "..."
                : project.description;

            card.innerHTML = `
            <h2>${displayTitle}</h2>
            <p>${displayDescription}</p>`;

            deniedContainer.appendChild(card);
          });
      });
    });
}
function approveProject(id) {
  fetch(`/api/approve/${id}`, { method: "POST" })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        showToast("Project approved!", { color: "success" });
        closeModal();
      } else {
        showToast(data.error || "Error approving project.", { color: "error" });
      }
      loadProjects();
    })
    .catch((error) => {
      console.error("Approval error:", error);
      showToast("Network error. Please try again.", { color: "error" });
    });
}

function confirmDenyProject(id, title) {
  openModalHTML(
    title,
    `
      <form id="denyForm" class="submit-form">
        <label for="denyMessage">Reason for denying this project:</label>
        <textarea id="denyMessage" name="denyMessage" required></textarea>

        <div style="display: flex; flex-direction: row; gap: 10px; margin-top: 10px;">
          <button type="submit" class="button">Deny</button>
          <button type="button" class="button" onclick="closeModal()">Cancel</button>
        </div>
      </form>
    `
  );

  document.getElementById("denyForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    fetch(`/api/deny/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          showToast("Project denied.", { color: "success" });
          closeModal();
        } else {
          showToast(data.error || "Error denying project.", { color: "error" });
        }
        loadProjects();
      })
      .catch((error) => {
        console.error("Approval error:", error);
        showToast("Network error. Please try again.", { color: "error" });
      });
  });
}
