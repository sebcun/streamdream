document.addEventListener("DOMContentLoaded", function () {
  const toReviewContainer = document.getElementById("myPendingReviewContainer");
  const approvedContainer = document.getElementById("myApprovedContainer");
  const deniedContainer = document.getElementById("myDeniedContainer");

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
      fetch("/api/projects")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response error");
          }
          return response.json();
        })
        .then((projectData) => {
          projectData = projectData.filter(
            (project) => project.author === data.slack_id
          );
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
    });
});
