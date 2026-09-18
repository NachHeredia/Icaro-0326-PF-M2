const TRIGGER_SELECTOR = ".hamburger-btn";
const MENU_SELECTOR = "#categories-menu";

export function initNavDropdownUi() {
  const trigger = document.querySelector(TRIGGER_SELECTOR);
  const menu = document.querySelector(MENU_SELECTOR);
  console.log("trigger:", trigger, "menu:", menu);
  if (!trigger || !menu) return;

  function openMenu() {
    menu.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  }

  function toggleMenu(event) {
    event.stopPropagation();
    const isOpen = menu.classList.contains("is-open");
    console.log("toggle! isOpen antes:", isOpen);
    isOpen ? closeMenu() : openMenu();
  }

  trigger.addEventListener("click", toggleMenu);

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && !trigger.contains(event.target)) {
      closeMenu();
    }
  });


  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });


  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}