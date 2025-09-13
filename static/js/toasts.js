// Get those toasts
const toastContainer = document.getElementById("toast-container");

// Lets pop the toast and showToast
function showToast(text, options = {}) {
  // Get the toast color, and then create the toast
  const { color = "default" } = options;
  const toast = document.createElement("div");
  toast.className = `toast ${color}`;
  toast.innerHTML = text;

  toastContainer.appendChild(toast);

  // For the animations :)
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  // Don't leave the toast too long, any longer for 5 seconds and it will be burnt!
  setTimeout(() => {
    removeToast(toast);
  }, 5000);
}

// removeToast from the toaster
function removeToast(toast) {
  toast.classList.remove("show");

  // Lets give the toast 30ms to pop out the toaster (animations)
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
}
