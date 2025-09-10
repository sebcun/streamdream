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
        data = data.filter((project) => project.approved === 1);
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
        data.forEach((project) => {
          const card = document.createElement("div");
          card.classList.add("card");
          card.onclick = () =>
            openModalHTML(
              project.title,
              `
                <span><i class="bi bi-stopwatch-fill"></i> ${project.hackatime_time} <i class="bi bi-person-fill" style="margin-left:10px"></i> @${project.author}</span>
                <p>${project.description}</p>
                <button class="button" onclick="window.open('${project.demo_link}', '_blank');">Demo <i class="bi bi-box-arrow-up-right"></i></button>
                <button class="button" onclick="window.open('${project.github_link}', '_blank');" style="margin-left:10px">Github <i class="bi bi-box-arrow-up-right"></i></button>
                <button class="button" onclick="closeModal()" style="margin-left:10px">Close</button>
                `
            );

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

          showcaseContainer.appendChild(card);
        });
      });
  }
});
