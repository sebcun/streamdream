const toReviewContainer = document.getElementById("toReviewContainer");
const approvedContainer = document.getElementById("approvedContainer");
const deniedContainer = document.getElementById("deniedContainer");

// Initial load
loadProjects();

function loadProjects() {
  // Set those to blank!
  toReviewContainer.innerHTML = "";
  approvedContainer.innerHTML = "";
  deniedContainer.innerHTML = "";

  // Fetch projects
  fetch("/api/projects")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response error");
      }
      return response.json();
    })
    .then((projectData) => {
      // Get projects to review
      toReview = projectData.filter((project) => project.approved === 0);
      // If none to review, add a card
      if (toReview.length == 0) {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
                <h2>No Projects in Review Queue</h2>
                <p></p>
              `;

        toReviewContainer.appendChild(card);
      }

      // Get approved projects
      approved = projectData.filter((project) => project.approved === 1);
      // If none, add a carrd
      if (approved.length == 0) {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
                <h2>No Projects have been Approved</h2>
                <p></p>
              `;

        approvedContainer.appendChild(card);
      }

      // Get denied projects
      denied = projectData.filter((project) => project.approved === -1);
      // If none add card
      if (denied.length == 0) {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
                <h2>No Projects have been Denied</h2>
                <p></p>
              `;

        deniedContainer.appendChild(card);
      }

      // For each to review
      toReview.forEach((project) => {
        fetch(`/api/user/${project.author}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response error");
            }
            return response.json();
          })
          .then((data) => {
            // Add card
            const card = document.createElement("div");
            card.classList.add("card");

            // Image
            if (project.image) {
              card.style.backgroundImage = `url(${project.image})`;
              card.style.backgroundSize = "cover";
              card.style.backgroundPosition = "center";
              card.style.backgroundRepeat = "no-repeat";
            }

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

            // Trim title and description to make sure it is visible
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

      // for each approved
      approved.forEach((project) => {
        fetch(`/api/user/${project.author}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response error");
            }
            return response.json();
          })
          .then((data) => {
            // Create card
            const card = document.createElement("div");
            card.classList.add("card");

            // Image background
            if (project.image) {
              card.style.backgroundImage = `url(${project.image})`;
              card.style.backgroundSize = "cover";
              card.style.backgroundPosition = "center";
              card.style.backgroundRepeat = "no-repeat";
            }

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

            // Trim title and description to make sure it fits
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

      // For each denied
      denied.forEach((project) => {
        fetch(`/api/user/${project.author}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response error");
            }
            return response.json();
          })
          .then((data) => {
            // Create card
            const card = document.createElement("div");
            card.classList.add("card");

            // Set image background
            if (project.image) {
              card.style.backgroundImage = `url(${project.image})`;
              card.style.backgroundSize = "cover";
              card.style.backgroundPosition = "center";
              card.style.backgroundRepeat = "no-repeat";
            }

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

            // Trim dispaly and description to make sure it fits
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

// Approve projects
function approveProject(id) {
  fetch(`/api/approve/${id}`, { method: "POST" })
    .then((response) => response.json())
    .then((data) => {
      // Yeah
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
  // This function is mainly to get the deny message :)
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
