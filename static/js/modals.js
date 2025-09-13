// FUNCTION: Open modal
function openModal(title, content) {
  // Get modal contents
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");

  // Set modal contents/show
  modalTitle.textContent = title;
  modalContent.textContent = content;
  modal.classList.add("show");
}

// FUNCTION: Open modal HTML
function openModalHTML(title, content) {
  // Get modal contents

  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-contents");

  // Set modal contents/show
  modalTitle.textContent = title;
  modalContent.innerHTML = content;
  modal.classList.add("show");
}

// FUNCTION: Hide modal
function closeModal() {
  const modal = document.getElementById("modal");
  modal.classList.remove("show");

  // Reset modal content just to ensure once it has disappeared
  setTimeout(function () {
    const modalContent = document.getElementById("modal-contents");
    modalContent.innerHTML = `<p id="modal-content">This is the modal content/</p>
            <button class="button" onclick="closeModal()">Close</button>`;
  }, 350);
}

// Close modal if you click off it
window.onclick = function (event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    closeModal();
  }
};
