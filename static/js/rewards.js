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
          card.onclick = () => openModal(reward.reward, reward.description);
          card.innerHTML = `
            <h2>${reward.reward}</h2>
            <p>${reward.price}</p>`;

          rewardContainer.appendChild(card);
        });
      });
  }
});
