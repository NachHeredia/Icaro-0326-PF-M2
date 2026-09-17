export function initNavbarUi() {
  const button = document.querySelector(".hamburger-btn");
  const menu = document.querySelector(".dropdown-menu");
  if (!button || !menu) return;

  function closeMenu() {
    menu.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
  }

  function toggleMenu(event) {
    event.stopPropagation();
    const isOpen = menu.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  }

  button.addEventListener("click", toggleMenu);

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && !button.contains(event.target)) {
      closeMenu();
    }
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}