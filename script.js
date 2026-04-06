const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links li");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

navItems.forEach(item => {
  item.addEventListener("click", () => {
    document.querySelector(".nav-links li.active")?.classList.remove("active");
    item.classList.add("active");
    navLinks.classList.remove("active");
  });
});