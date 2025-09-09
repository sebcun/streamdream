showcaseContainer = document.getElementById("showcaseContainer");

document.addEventListener("DOMContentLoaded", function () {
  if (showcaseContainer) {
    fetch("/api/projects")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response error");
        }
        return response.json();
      })
      .then((data) => {
        if (data.length == 0) {
          const card = document.createElement("div");
          card.classList.add("card");
          card.onclick = () =>
            openModal(
              "No Projects Yet",
              "Start creating your project today, and submit it when you are done for it to appear here!"
            );

          const displayDescription =
            "Start creating your project today, and submit it when you are done for it to appear here!".slice(
              0,
              30
            ) + "...";

          card.innerHTML = `
            <h2>No Projects Yet</h2>
            <p>${displayDescription}</p>`;

          showcaseContainer.appendChild(card);
        }
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

          showcaseContainer.appendChild(card);
        });
      });
  }
});
