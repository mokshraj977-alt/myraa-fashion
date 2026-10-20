const announcement = document.querySelector("#announcement");
const collectionGrid = document.querySelector("#collection-grid");
const productGrid = document.querySelector("#product-grid");
const inspirationGrid = document.querySelector("#inspiration-grid");
const productFilter = document.querySelector("#product-filter");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const searchToggle = document.querySelector(".search-toggle");
const searchPanel = document.querySelector("#search-panel");
const searchInput = document.querySelector("#catalog-search");
const searchClose = document.querySelector(".search-close");

announcement.textContent = siteConfig.announcement;
document.querySelector("#copyright-year").textContent = new Date().getFullYear();

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const makeImage = (src, alt, className = "") => {
  const image = document.createElement("img");
  image.src = src;
  image.alt = alt;
  image.loading = "lazy";
  image.className = className;
  image.addEventListener("error", () => {
    image.removeAttribute("src");
    image.classList.add("image-fallback");
    image.setAttribute("role", "img");
    image.setAttribute("aria-label", alt);
  }, { once: true });
  return image;
};

function renderCollections() {
  collectionGrid.replaceChildren(...collections.map((collection) => {
    const card = document.createElement("article");
    card.className = "collection-card";
    const imageWrap = document.createElement("div");
    imageWrap.className = "collection-image-wrap";
    imageWrap.append(makeImage(collection.image, collection.alt, "cover-image"));
    const number = document.createElement("span");
    number.className = "collection-number";
    number.textContent = collection.number;
    imageWrap.append(number);
    const copy = document.createElement("div");
    copy.className = "collection-copy";
    const text = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = collection.name;
    const description = document.createElement("p");
    description.textContent = collection.description;
    text.append(title, description);
    const link = document.createElement("a");
    link.className = "round-link";
    link.href = "#new-arrivals";
    link.dataset.category = collection.category;
    link.setAttribute("aria-label", `Explore sample ${collection.name} styles`);
    link.innerHTML = '<span aria-hidden="true">↗</span>';
    copy.append(text, link);
    card.append(imageWrap, copy);
    return card;
  }));
}

function renderProducts(category = "all", query = "") {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filtered = products.filter((product) => {
    const matchesCategory = category === "all" || product.category === category;
    const matchesQuery = !normalizedQuery || `${product.name} ${product.category}`.toLocaleLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });

  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "empty-results";
    empty.textContent = "No sample styles match that search. Try a different word.";
    productGrid.replaceChildren(empty);
    return;
  }

  productGrid.replaceChildren(...filtered.map((product, index) => {
    const card = document.createElement("article");
    card.className = "product-card";
    const imageWrap = document.createElement("div");
    imageWrap.className = "product-image-wrap";
    imageWrap.append(makeImage(product.image, product.alt, "cover-image"));
    const number = document.createElement("span");
    number.className = "product-number";
    number.textContent = String(index + 1).padStart(2, "0");
    imageWrap.append(number);
    const details = document.createElement("div");
    details.className = "product-details";
    const meta = document.createElement("div");
    meta.className = "product-meta";
    const categoryLabel = document.createElement("span");
    categoryLabel.textContent = product.category;
    const price = document.createElement("span");
    price.textContent = formatPrice(product.price);
    meta.append(categoryLabel, price);
    const name = document.createElement("h3");
    name.textContent = product.name;
    const enquiry = document.createElement("a");
    enquiry.className = "product-enquiry";
    const message = `Hi, I saw ${product.name} on the MYRAA website. Could you please confirm its current price and availability?`;
    enquiry.href = `https://wa.me/${siteConfig.phone}?text=${encodeURIComponent(message)}`;
    enquiry.target = "_blank";
    enquiry.rel = "noopener noreferrer";
    enquiry.textContent = "Enquire on WhatsApp";
    enquiry.setAttribute("aria-label", `Ask MYRAA about ${product.name} on WhatsApp`);
    details.append(meta, name, enquiry);
    card.append(imageWrap, details);
    return card;
  }));
}

function renderInspiration() {
  inspirationGrid.replaceChildren(...inspirationImages.map((item, index) => {
    const figure = document.createElement("figure");
    figure.className = `inspiration-item inspiration-item-${index + 1}`;
    figure.append(makeImage(item.image, item.alt, "cover-image"));
    return figure;
  }));
}

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navigation.classList.remove("is-open");
}

function closeSearch() {
  searchPanel.hidden = true;
  searchToggle.setAttribute("aria-expanded", "false");
}

renderCollections();
renderInspiration();

for (const collection of collections) {
  const option = document.createElement("option");
  option.value = collection.category;
  option.textContent = collection.name;
  productFilter.append(option);
}
renderProducts();

collectionGrid.addEventListener("click", (event) => {
  const link = event.target.closest("[data-category]");
  if (!link) return;
  productFilter.value = link.dataset.category;
  renderProducts(productFilter.value);
});

productFilter.addEventListener("change", () => renderProducts(productFilter.value));
searchInput.addEventListener("input", () => {
  productFilter.value = "all";
  renderProducts("all", searchInput.value);
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  navigation.classList.toggle("is-open", !isOpen);
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

searchToggle.addEventListener("click", () => {
  const opening = searchPanel.hidden;
  searchPanel.hidden = !opening;
  searchToggle.setAttribute("aria-expanded", String(opening));
  if (opening) searchInput.focus();
});
searchClose.addEventListener("click", () => {
  closeSearch();
  searchToggle.focus();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    if (!searchPanel.hidden) {
      closeSearch();
      searchToggle.focus();
    }
  }
});

if (siteConfig.instagramUrl) {
  document.querySelector("#inspiration-title").textContent = "Follow the style edit";
  const instagramLink = document.createElement("a");
  instagramLink.className = "text-link";
  instagramLink.href = siteConfig.instagramUrl;
  instagramLink.target = "_blank";
  instagramLink.rel = "noopener noreferrer";
  instagramLink.textContent = "Visit Instagram profile ↗";
  document.querySelector(".inspiration-section .section-heading").append(instagramLink);
}
