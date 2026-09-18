const SEARCH_SELECTOR = "#search-bar";

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function initSearchUi() {
    console.log("initSearchUi corrió");
  const searchInput = document.querySelector(SEARCH_SELECTOR);
  const cards = document.querySelectorAll(".product-card");
  if (!searchInput || !cards.length) return;

  const sections = document.querySelectorAll(".category-section");

  function restoreCategoryFilter() {
    const hash = window.location.hash.replace("#", "").trim().toLowerCase();

    cards.forEach((card) => { card.style.display = ""; });

    sections.forEach((section) => {
      const cat = section.getAttribute("data-category")?.toLowerCase();
      if (!cat) {
        section.style.display = "block";
      } else {
        section.style.display = hash ? (cat === hash ? "block" : "none") : "block";
      }
    });
  }

  searchInput.addEventListener("input", () => {
    const query = normalize(searchInput.value.trim());

    if (!query) {
      restoreCategoryFilter();
      return;
    }

    sections.forEach((section) => {
      let matches = 0;
      section.querySelectorAll(".product-card").forEach((card) => {
        const name = normalize(card.dataset.name || "");
        const isMatch = name.includes(query);
        card.style.display = isMatch ? "" : "none";
        if (isMatch) matches++;
      });
      section.style.display = matches > 0 ? "block" : "none";
    });
  });
}