// Consts
const adminOrdersContainer = document.getElementById("adminOrdersContainer");
const adminActionsContainer = document.getElementById("adminActionsContainer");

// Create admin actions
//    Create FAQ
const faqCard = document.createElement("div");
faqCard.classList.add("card");
faqCard.onclick = () => createNewFAQ();
faqCard.innerHTML = `<h2>Create a new FAQ</h2>`;
adminActionsContainer.appendChild(faqCard);

//    Create Rule
const ruleCard = document.createElement("div");
ruleCard.classList.add("card");
ruleCard.onclick = () => createNewRule();
ruleCard.innerHTML = `<h2>Create a new Rule</h2>`;
adminActionsContainer.appendChild(ruleCard);

//    Create Reward
const rewardCard = document.createElement("div");
rewardCard.classList.add("card");
rewardCard.onclick = () => createNewReward();
rewardCard.innerHTML = `<h2>Create a new Reward</h2>`;
adminActionsContainer.appendChild(rewardCard);

//    Manage Reviewers
const reviewerManageCard = document.createElement("div");
reviewerManageCard.classList.add("card");
reviewerManageCard.onclick = () => manageReviewers();
reviewerManageCard.innerHTML = `<h2>Manage Reviewers</h2>`;
adminActionsContainer.appendChild(reviewerManageCard);

// Load Orders
loadOrders();

// FUNCTION: Create new FAQ
function createNewFAQ() {
  // Open Modal
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

  // Get Form and add event listener
  document
    .getElementById("newFAQForm")
    .addEventListener("submit", function (e) {
      // cancel default form (so page doesnt refresh)
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      // Complete POST request
      fetch(`/api/createfaq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        // Get response and data to return for status code
        .then((response) => {
          return response.json().then((data) => ({ response, data }));
        })
        .then(({ response, data }) => {
          // If there is an error, throw it
          if (data["error"]) {
            throw new Error(`${response.status} | ${data["error"]}`);
          }

          // Success
          showToast("FAQ created!", { color: "success" });
          closeModal();
        })
        // Catch any errors, show toast and log to console
        .catch((error) => {
          console.log("Error creating FAQ:", error);
          showToast(error.message, { color: "error" });
        });
    });
}

// FUNCTION: Create new rule
function createNewRule() {
  // Open Modal
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

  // Get form and add event listener
  document
    .getElementById("newRuleForm")
    .addEventListener("submit", function (e) {
      // Cancel default form
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      // Complete POST request
      fetch(`/api/createrule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        // Get response and data to return for status code
        .then((response) => {
          return response.json().then((data) => ({ response, data }));
        })
        .then(({ response, data }) => {
          // If there is an error, throw it
          if (data["error"]) {
            throw new Error(`${response.status} | ${data["error"]}`);
          }

          // Success
          showToast("Rule created!", { color: "success" });
          closeModal();
        })
        // Catch any errors, show toast and log to console
        .catch((error) => {
          console.error("Error creating rule:", error);
          showToast(error.message, { color: "error" });
        });
    });
}

// FUNCTION: Create new reward
function createNewReward() {
  // Open Modal
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

  // Get form and add event listener
  document
    .getElementById("newRewardForm")
    .addEventListener("submit", function (e) {
      // Prevent default form shenanigans
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      // Complete post request
      fetch(`/api/createreward`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        // Get response and data to return for status code
        .then((response) => {
          response.json().then((data) => ({ response, data }));
        })
        .then(({ response, data }) => {
          // If there is an error, throw it
          if (data["error"]) {
            throw new Error(`${response.status} | ${data["error"]}`);
          }

          // Success
          showToast("Reward created!", { color: "success" });
          closeModal();
        })
        // Catch any errors, show toast and log to console
        .catch((error) => {
          console.error("Error creating reward:", error);
          showToast(error.message, { color: "error" });
        });
    });
}

// FUNCTION: Manage reviewers
function manageReviewers() {
  // Open modal
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

  // Get form and add event listener
  document
    .getElementById("manageReviewersForm")
    .addEventListener("submit", function (e) {
      // Prevent default form functions
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      // Get the action (grant = -1, revoke = 0)
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
        // Get response and data to return for status code
        .then((response) => {
          return response.json().then((data) => ({ response, data }));
        })
        .then(({ response, data }) => {
          // If there is an error, throw it
          if (data["error"]) {
            throw new Error(`${response.status} | ${data["error"]}}`);
          }

          // Success
          if (data.reviewerStatus === -1) {
            showToast("Granted reviewer access!", { color: "success" });
            closeModal();
          } else {
            showToast("Revoked reviewer access.", { color: "success" });
            closeModal();
          }
        })
        // Catch any errors, show toast and log to console
        .catch((error) => {
          console.log("Error managing reviewer status:", error);
          showToast(error.message, { color: "error" });
        });
    });
}

// FUNCTION: Load orders
function loadOrders() {
  // Clear order container first
  adminOrdersContainer.innerHTML = "";

  // Complete get request
  fetch("/api/orders")
    // Get response and data to return for status code
    .then((response) => {
      return response.json().then((data) => ({ response, data }));
    })
    .then(({ response, data }) => {
      // IF there is an error throw it!
      if (data["error"]) {
        throw new Error(`${response.status} | ${data["error"]}`);
      }

      // If there are no orders, add the no order card
      if (data.length == 0) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
                <h2>No Orders</h2>
                <p></p>
              `;
        adminOrdersContainer.appendChild(card);
      }

      // For each order
      data.forEach((order) => {
        // Create a card
        const card = document.createElement("div");
        card.classList.add("card");

        // Get the status text, as well as add the colors for if it is shipped, cancelled, pending
        let statusText = "PENDING";
        const statusValue = Number(order.status);
        if (statusValue === 1) {
          card.classList.add("green");
          statusText = "SHIPPED";
        } else if (statusValue === -1) {
          card.classList.add("red");
          statusText = "CANCELLED";
        }

        // On card click
        card.onclick = () => {
          // Open modal with order details
          openModalHTML(
            order.item_name,
            `
              <div id="submitOrderForm" class="submit-form">
                <label for="slackID">Slack ID:</label>
                <input type="text" id="slackID" name="slackID" disabled value="${order.slack_id}">

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

                <button class="button" onclick="markOrder(${order.id}, 1);">Mark as Shipped</button>
                <button class="button" onclick="markOrder(${order.id}, 0);">Mark as Pending</button>
                <button class="button" onclick="markOrder(${order.id}, -1);">Mark as Cancelled</button>
                <button class="button" onclick="closeModal()" >Close</button>
              </div>
            `
          );
        };

        // Cut down the display title to make sure it fits
        const displayTitle =
          order.item_name.length > 75
            ? order.item_name.slice(0, 75) + "..."
            : order.item_name;

        card.innerHTML = `
            <h2>${displayTitle}</h2>`;

        adminOrdersContainer.appendChild(card);
      });
    })
    // Catch any errors, show toast and log to console
    .catch((error) => {
      console.error("Error loading orders:", error);
      showToast(error.message, { color: "error" });
    });
}

// FUNCTION: Mark order
function markOrder(orderid, status) {
  console.log(orderid, status);
  fetch(`/api/order/${orderid}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderStatus: status }),
  })
    // Get response and data to return for status code
    .then((response) => {
      return response.json().then((data) => ({ response, data }));
    })
    .then(({ response, data }) => {
      // If there is an error, throw that!!
      if (data["error"]) {
        throw new Error(`${response.status} | ${data["error"]}`);
      }

      // Success
      if (status == 1) {
        showToast("Order marked as shipped!", { color: "success" });
        closeModal();
      } else if (status == -1) {
        showToast("Order marked as cancelled.", { color: "success" });
        closeModal();
      } else {
        showToast("Order marked as pending.", { color: "success" });
        closeModal();
      }
      loadOrders();
    })
    // Catch any errors, show toast and log to console
    .catch((error) => {
      console.log("Error updating order status:", error);
      showToast(error.message, { color: "error" });
    });
}
