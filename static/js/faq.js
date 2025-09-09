faqContainer = document.getElementById("faqContainer");

document.addEventListener("DOMContentLoaded", function () {
  if (faqContainer) {
    fetch("/api/faqs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response error");
        }
        return response.json();
      })
      .then((data) => {
        data.forEach((faq) => {
          const card = document.createElement("div");
          card.classList.add("card");
          if (faq.color) {
            card.classList.add(faq.color);
          }
          card.onclick = () => openModal(faq.question, faq.answer);

          const displayQuestion =
            faq.question.length > 75
              ? faq.question.slice(0, 75) + "..."
              : faq.question;

          const displayAnswer =
            faq.answer.length > 30
              ? faq.answer.slice(0, 30) + "..."
              : faq.answer;

          card.innerHTML = `
            <h2>${displayQuestion}</h2>
            <p>${displayAnswer}</p>`;

          faqContainer.appendChild(card);
        });
      });
  }
});
