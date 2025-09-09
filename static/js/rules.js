rulesContainer = document.getElementById("rulesContainer");

document.addEventListener("DOMContentLoaded", function () {
  if (rulesContainer) {
    fetch("/api/rules")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response error");
        }
        return response.json();
      })
      .then((data) => {
        data.forEach((rule) => {
          const card = document.createElement("div");
          card.classList.add("card");
          if (rule.color) {
            card.classList.add(rule.color);
          }
          card.onclick = () => openModal(rule.rule, rule.description);

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
      });
  }
});
