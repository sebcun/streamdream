const toastContainer = document.getElementById("toast-container");

function showToast(text, options = {}) {
  const { color = "default" } = options;
  const toast = document.createElement("div");
  toast.className = `toast ${color}`;
  toast.innerHTML = text;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    removeToast(toast);
  }, 5000);
}

function removeToast(toast) {
  toast.classList.remove("show");

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
}
