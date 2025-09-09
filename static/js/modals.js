function openModal(title, content) {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");

  modalTitle.textContent = title;
  modalContent.textContent = content;
  modal.classList.add("show");
}

function openModalHTML(title, content) {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-contents");

  modalTitle.textContent = title;
  modalContent.innerHTML = content;
  modal.classList.add("show");
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.classList.remove("show");

  setTimeout(function () {
    const modalContent = document.getElementById("modal-contents");
    modalContent.innerHTML = `<p id="modal-content">This is the modal content/</p>
            <button class="button" onclick="closeModal()">Close</button>`;
  }, 350);
}
window.onclick = function (event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    closeModal();
  }
};
