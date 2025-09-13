rulesContainer = document.getElementById("rulesContainer");

document.addEventListener("DOMContentLoaded", function () {
  // Check rules to be sure
  if (rulesContainer) {
    fetch("/api/rules")
      .then((response) => {
        return response.json().then((data) => ({ response, data }));
      })
      .then(({ response, data }) => {
        // If there is an error, throw that!
        if (data["error"]) {
          throw new Error(`${response.status} | ${data["error"]}`);
        }

        // Success
        // For each rule
        data.forEach((rule) => {
          // Create card
          const card = document.createElement("div");
          card.classList.add("card");
          if (rule.color) {
            card.classList.add(rule.color);
          }
          card.onclick = () => openModal(rule.rule, rule.description);

          // Trim rule and descriptiont o make sure it fits
          const displayRule =
            rule.rule.length > 75 ? rule.rule.slice(0, 75) + "..." : rule.rule;

          const displayDescription =
            rule.description.length > 30
              ? rule.description.slice(0, 30) + "..."
              : rule.description;

          card.innerHTML = `
            <h2>${displayRule}</h2>
            <p>${displayDescription}</p>`;

          rulesContainer.appendChild(card);
        });
      })
      .catch((error) => {
        console.log("Error getting rules:", error);
        showToast(error.message, { color: "error" });
      });
  }
});
