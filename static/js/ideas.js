function generateIdea() {
  fetch("/api/ideas")
    .then((response) => {
      return response.json().then((data) => ({ response, data }));
    })
    .then(({ response, data }) => {
      // If there is an error throw that!!!
      if (data["error"]) {
        throw new Error(`${response.status} | ${data["error"]}`);
      }

      // Success
      // If there are no ideas
      if (data.length === 0) {
        openModal(
          "No ideas available.",
          "There are no ideas to show you at the moment! Maybe be creative?"
        );
        return;
      }

      // Select a random idea
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomIdea = data[randomIndex];
      openModal(randomIdea.title, randomIdea.description);
    })
    // Catch any errors, show toast and log to console
    .catch((error) => {
      console.log("Error fetching Ideas:", error);
      showToast(error.message, { color: "error" });
    });
}
