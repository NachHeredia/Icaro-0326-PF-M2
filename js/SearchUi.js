const SEARCH_SELECTOR = "#search-bar";
const RESULTS_LIMIT = 8;

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getCategoriesPagePath() {
  const isInPagesFolder = window.location.pathname.includes("/pages/");
  return isInPagesFolder ? "categoriesSection.html" : "pages/categoriesSection.html";
}


function initInlineFilter(searchInput) {
  const sections = document.querySelectorAll(".category-section");

  function restoreCategoryFilter() {
    const hash = window.location.hash.replace("#", "").trim().toLowerCase();

    sections.forEach((section) => {
      section.querySelectorAll(".product-card").forEach((card) => { card.style.display = ""; });
      const cat = section.getAttribute("data-category")?.toLowerCase();
      section.style.display = !cat || !hash || cat === hash ? "block" : "none";
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
        const isMatch = normalize(card.dataset.name || "").includes(query);
        card.style.display = isMatch ? "" : "none";
        if (isMatch) matches++;
      });
      section.style.display = matches > 0 ? "block" : "none";
    });
  });
}


async function fetchProductIndex() {
  const path = getCategoriesPagePath();
  const response = await fetch(path);
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");

  return Array.from(doc.querySelectorAll(".product-card")).map((card) => {
    const relativeImg = card.querySelector(".product-card__media img")?.getAttribute("src") || "";
    return {
      name: card.dataset.name || "",
      category: card.dataset.category || "",
      // resolvemos la ruta de la imagen contra la URL real de categoriesSection.html,
      // así funciona sin importar desde qué página se dispara la búsqueda
      image: relativeImg ? new URL(relativeImg, response.url).href : "",
      price: card.querySelector(".price-value")?.textContent.trim() || "",
    };
  });
}

function buildResultsContainer(searchInput) {
  const parent = searchInput.closest(".search-container");
  let container = parent.querySelector(".search-results");
  if (container) return container;

  container = document.createElement("div");
  container.className = "search-results";
  container.hidden = true;
  parent.appendChild(container);
  return container;
}

function renderResults(container, items, categoriesPagePath) {
  if (!items.length) {
    container.innerHTML = `<p class="search-results__empty">No se encontraron productos.</p>`;
    container.hidden = false;
    return;
  }

  container.innerHTML = items
    .slice(0, RESULTS_LIMIT)
    .map((item) => `
      <a class="search-result" href="${categoriesPagePath}#${item.category}">
        <img src="${item.image}" alt="${item.name}">
        <span class="search-result__info">
          <span class="search-result__name">${item.name}</span>
          <span class="search-result__price">${item.price}</span>
        </span>
      </a>
    `)
    .join("");

  container.hidden = false;
}

async function initDropdownSearch(searchInput) {
  const resultsContainer = buildResultsContainer(searchInput);
  const categoriesPagePath = getCategoriesPagePath();

  let productIndex = [];
  try {
    productIndex = await fetchProductIndex();
  } catch (error) {
    console.error("No se pudo cargar el índice de productos:", error);
    return;
  }

  searchInput.addEventListener("input", () => {
    const query = normalize(searchInput.value.trim());

    if (!query) {
      resultsContainer.hidden = true;
      return;
    }

    const matches = productIndex.filter((item) => normalize(item.name).includes(query));
    renderResults(resultsContainer, matches, categoriesPagePath);
  });

  document.addEventListener("click", (event) => {
    if (!resultsContainer.contains(event.target) && event.target !== searchInput) {
      resultsContainer.hidden = true;
    }
  });
}

export function initSearchUi() {
  const searchInput = document.querySelector(SEARCH_SELECTOR);
  if (!searchInput) return;

  const hasProductCards = document.querySelectorAll(".product-card").length > 0;

  hasProductCards ? initInlineFilter(searchInput) : initDropdownSearch(searchInput);
}