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
