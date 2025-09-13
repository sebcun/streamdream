document.addEventListener("DOMContentLoaded", function () {
  // Get all containers
  const toReviewContainer = document.getElementById("myPendingReviewContainer");
  const approvedContainer = document.getElementById("myApprovedContainer");
  const deniedContainer = document.getElementById("myDeniedContainer");
  const orderContainer = document.getElementById("myOrderContainer");

  // Fetch me! This is to ensure only projects you created show
  fetch("/api/me")
    // Get response and data to return for status code
    .then((response) => {
      return response.json().then((data) => ({ response, data }));
    })
    .then(({ response, data }) => {
      // If there is an error throw it!
      if (data["error"]) {
        throw new Error(`${response.status} | ${data["error"]}`);
      }

      // Success

      // First lets fetch projects
      fetch("/api/projects")
        // Get response and data to return for status code
        .then((responseP) => {
          return responseP.json().then((dataP) => ({ responseP, dataP }));
        })
        .then(({ responseP, dataP }) => {
          // If there is an error throw it...
          if (dataP["error"]) {
            throw new Error(`${responseP.status} | ${dataP["error"]}`);
          }

          // Success

          // Change dataP so it is only projects the authed user made
          dataP = dataP.filter((project) => project.author === data.slack_id);

          // Get projects that status are 0 (to review)
          toReview = dataP.filter((project) => project.approved === 0);
          // If there are no projects to review, show that card.
          if (toReview.length == 0) {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <h2>No Projects in Review Queue</h2>
                <p></p>
              `;
            toReviewContainer.appendChild(card);
          }

          // Get projects that status are 1 (approved)
          approved = dataP.filter((project) => project.approved === 1);
          // If there are no projects that are approved, show that card.
          if (approved.length == 0) {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <h2>No Projects have been Approved</h2>
                <p></p>
              `;

            approvedContainer.appendChild(card);
          }

          // Get projects that status are -1 (denied)
          denied = dataP.filter((project) => project.approved === -1);
          // If there are no projects that are denied, show that card.
          if (denied.length == 0) {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <h2>No Projects have been Denied</h2>
                <p></p>
              `;

            deniedContainer.appendChild(card);
          }

          createProjectCards(toReview, toReviewContainer);
          createProjectCards(
            approved,
            approvedContainer,
            (project) => `<small>Approved By: @${project.reviewer}</small><br>`
          );
          createProjectCards(
            denied,
            deniedContainer,
            (project) =>
              `<small>Denied By: @${project.reviewer} for "${project.deny_message}"</small><br>`
          );
        });

      // Now lets fetch orders!
      fetch("/api/orders")
        // Get response and data to return for status code
        .then((responseO) => {
          return responseO.json().then((dataO) => ({ responseO, dataO }));
        })
        .then(({ responseO, dataO }) => {
          // If there is an error, throw it!
          if (dataO["error"]) {
            throw new Error(`${responseO.status} | ${dataO["error"]}`);
          }

          // Success
          // Get orders where the userID = current userID
          dataO = dataO.filter((order) => order.slack_id === data.slack_id);
          // If there are no orders, show that Card!
          if (dataO.length == 0) {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <h2>No Orders</h2>
                <p></p>
              `;
            orderContainer.appendChild(card);
          }

          // For each order
          dataO.forEach((order) => {
            const card = document.createElement("div");
            card.classList.add("card");

            let statusText = "PENDING";
            const statusValue = Number(order.status);
            if (statusValue === 1) {
              card.classList.add("green");
              statusText = "SHIPPED";
            } else if (statusValue === -1) {
              card.classList.add("red");
              statusText = "CANCELLED";
            }

            card.onclick = () => {
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
        })
        .catch((error) => {
          console.log("Error fetching orders:", error);
        });
    })
    .catch((error) => {
      console.log("Error fetching profile:", error);
      showToast(error.message, { color: "error" });
    });
});

function createProjectCards(projects, container, getModalExtra = () => "") {
  // For each project
  projects.forEach((project) => {
    // First fetch the author so we can get their first name to dispaly
    fetch(`/api/user/${project.author}`)
      // Get response and data to return for status code
      .then((response) => {
        return response.json().then((data) => ({ response, data }));
      })
      .then(({ response, data }) => {
        // If there is an error throw it
        if (data["error"]) {
          throw new Error(`${response.status} | ${data["error"]}`);
        }

        // Success
        const card = document.createElement("div");
        card.classList.add("card");
        card.onclick = () => {
          openModalHTML(
            project.title,
            `
              <span><i class="bi bi-stopwatch-fill"></i> ${
                project.hackatime_time
              } <i class="bi bi-person-fill" style="margin-left:10px"></i> <a href="https://hackclub.slack.com/team/${
              project.author
            }" target="_blank">@${data.name}</a></span>
              <p>${project.description}</p>
              ${getModalExtra(project)}
              <button class="button" onclick="window.open('${
                project.demo_link
              }', '_blank');">Demo <i class="bi bi-box-arrow-up-right"></i></button>
              <button class="button" onclick="window.open('${
                project.github_link
              }', '_blank');" style="margin-left:10px">Github <i class="bi bi-box-arrow-up-right"></i></button>
              <button class="button" onclick="closeModal()" style="margin-left:10px; margin-top: 10px">Close</button>
            `
          );
        };

        // Trim titles and descriptions so they arent TOO long <3
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

        container.appendChild(card);
      })
      .catch((error) => {
        console.log("Error fetching user:", error);
      });
  });
}
