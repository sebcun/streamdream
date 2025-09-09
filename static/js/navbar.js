const icon = document.getElementById("burger");
const navbar = document.getElementById("navbar");

function toggleNav() {
  if (navbar.className === "navbar") {
    navbar.className += " responsive";
  } else {
    navbar.className = "navbar";
  }

  icon.classList.toggle("active");
}

function toggleProfileDropdown() {
  const dropdown = document.getElementById("profile-dropdown");
  dropdown.classList.toggle("show");
}
