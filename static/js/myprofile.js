document.addEventListener("DOMContentLoaded", function () {
  const toReviewContainer = document.getElementById("myPendingReviewContainer");
  const approvedContainer = document.getElementById("myApprovedContainer");
  const deniedContainer = document.getElementById("myDeniedContainer");
  const orderContainer = document.getElementById("myOrderContainer");

  fetch("/api/me")
    .then((response) => {
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

      fetch("/api/orders")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response error");
          }
          return response.json();
        })
        .then((orderData) => {
          orderData = orderData.filter(
            (order) => order.slack_id === data.slack_id
          );
          if (orderData.length == 0) {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <h2>No Orders</h2>
                <p></p>
              `;
            orderContainer.appendChild(card);
          }

          orderData.forEach((order) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.onclick = () => {
              let statusText = "PENDING";
              const statusValue = Number(order.status);
              if (statusValue === 1) {
                statusText = "SHIPPED";
              } else if (statusValue === -1) {
                statusText = "CANCELLED";
              }

              openModalHTML(
                order.item_name,
                `
                <div id="submitOrderForm" class="submit-form">
                  <label for="fullName">Full Name:</label>
                  <input type="text" id="fullName" name="fullName" disabled value="${order.full_name}">

                  <label for="email">Email:</label>
                  <input type="email" id="email" name="email" disabled value="${order.email}">

                  <label for="phone">Phone Number:</label>
                  <input type="tel" id="phone" name="phone" disabled value="${order.phone}">

                  <label for="address">Address:</label>
                  <input type="text" id="address" name="address" disabled value="${order.address}">

                  <label for="addressLine2">Address Line 2:</label>
                  <input type="text" id="addressLine2" name="addressLine2" disabled value="${order.address_two}">

                  <label for="city">City:</label>
                  <input type="text" id="city" name="city" disabled value="${order.city}">

                  <label for="state">State / Province / Region:</label>
                  <input type="text" id="state" name="state"disabled value="${order.state}">

                  <label for="zip">Postcode / Zipcode:</label>
                  <input type="text" id="zip" name="zip" disabled value="${order.zip}">

                  <label for="country">Country:</label>
                  <input type="text" id="country" name="country" disabled value="${order.country}">

                  <label for="country">Country:</label>
                  <input type="text" id="country" name="country" disabled value="${order.country}">

                  <label for="created_at">Created At:</label>
                  <input type="text" id="created_at" name="created_at" disabled value="${order.created_at}">

                  <label for="status">Status:</label>
                  <input type="text" id="status" name="status" disabled value="${statusText}">

                  <button class="button" onclick="closeModal()" style="margin-left:10px; margin-top: 10px">Close</button>
                </div>
                `
              );
            };

            const displayTitle =
              order.item_name.length > 75
                ? order.item_name.slice(0, 75) + "..."
                : order.item_name;

            card.innerHTML = `
            <h2>${displayTitle}</h2>`;

            orderContainer.appendChild(card);
          });
        });
    });
});
