rewardContainer = document.getElementById("rewardContainer");

document.addEventListener("DOMContentLoaded", function () {
  if (rewardContainer) {
    fetch("/api/rewards")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response error");
        }
        return response.json();
      })
      .then((data) => {
        data.forEach((reward) => {
          const card = document.createElement("div");
          card.classList.add("card");
          if (reward.color) {
            card.classList.add(reward.color);
          }
          card.onclick = () =>
            showReward(
              reward.id,
              reward.reward,
              reward.description,
              reward.price
            );
          card.innerHTML = `
            <h2>${reward.reward}</h2>
            <p>${reward.price} Hours</p>`;

          rewardContainer.appendChild(card);
        });
      });
  }
});

function showReward(id, title, description, hours) {
  fetch("/api/me")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        openModalHTML(
          title,
          `
          <p>${description}</p>
          <button class="button" onclick="closeModal()" style="margin-left:10px">Close</button>
        `
        );
      } else {
        const escapedTitle = title
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'")
          .replace(/\n/g, "\\n");
        const escapedData = JSON.stringify(data)
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'")
          .replace(/\n/g, "\\n");

        openModalHTML(
          title,
          `
          <p>${description}</p>
          <button class="button" onclick='purchaseReward("${escapedData}", ${id}, "${escapedTitle}", ${hours})' style="margin-left:10px">Order for ${hours} hours</button>
          <button class="button" onclick="closeModal()" style="margin-left:10px">Close</button>
        `
        );
      }
    });
}

function purchaseReward(userDataString, id, title, hours) {
  const userData = JSON.parse(userDataString);
  console.log(userData);
  if (userData.balance >= hours) {
    openModalHTML(
      `Confirm Order of ${title}`,
      `
          <form id="submitOrderForm" class="submit-form">
            <label for="fullName">Full Name:</label>
            <input type="text" id="fullName" name="fullName" required value="${userData.name}">

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required value="${userData.email}">

            <label for="phone">Phone Number:</label>
            <input type="tel" id="phone" name="phone" required>

            <label for="address">Address:</label>
            <input type="text" id="address" name="address" required placeholder="1 John St">

            <label for="addressLine2">Address Line 2:</label>
            <input type="text" id="addressLine2" name="addressLine2" placeholder="Apt / Suite / Bldg / Unit">

            <label for="city">City:</label>
            <input type="text" id="city" name="city" required>

            <label for="state">State / Province / Region:</label>
            <input type="text" id="state" name="state" required>

            <label for="zip">Postcode / Zipcode:</label>
            <input type="text" id="zip" name="zip" required>

            <label for="country">Country:</label>
            <input type="text" id="country" name="country" required>

            <button type="submit" class="button">Confirm Order</button>
          </form>
        `
    );

    document
      .getElementById("submitOrderForm")
      .addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        data.itemID = id;
        data.itemPrice = hours;
        data.itemName = title;

        fetch("/api/submitorder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (response.ok) {
              showToast("Order submitted successfully!", {
                color: "success",
              });
              closeModal();
            } else {
              return response.json().then((errorData) => {
                showToast(errorData.error, {
                  color: "error",
                });

                closeModal();
              });
            }
          })
          .catch((error) => {
            console.error("Submission error:", error);
            showToast("Network error. Please try again.", { color: "error" });
          });
      });
  } else {
    showToast("You do not have enough hours for this.", { color: "error" });
    closeModal();
  }
}
