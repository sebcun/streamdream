faqContainer = document.getElementById("faqContainer");

document.addEventListener("DOMContentLoaded", function () {
  // Just to make sure the FAQ exist as this script may be included on another page
  if (faqContainer) {
    fetch("/api/faqs")
      .then((response) => {
        return response.json().then((data) => ({ response, data }));
      })
      .then(({ response, data }) => {
        // If there is an error throw that!!!
        if (data["error"]) {
          throw new Error(`${response.status} | ${data["error"]}`);
        }

        // Success
        // For each FAQ item
        data.forEach((faq) => {
          // Create a card
          const card = document.createElement("div");
          card.classList.add("card");
          if (faq.color) {
            card.classList.add(faq.color);
          }
          card.onclick = () => openModal(faq.question, faq.answer);

          // Trim display question and answer to ensure it fits
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
      })
      // Catch any errors, show toast and log to console
      .catch((error) => {
        console.log("Error fetching FAQs:", error);
        showToast(error.message, { color: "error" });
      });
  }
});
