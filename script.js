document.addEventListener("DOMContentLoaded", () => {
  init();
});

async function init() {

  /* =========================================================
     NAVIGATION
  ========================================================= */
  const toggle = document.getElementById("toggle");
  const nav = document.getElementById("nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  }

  /* =========================================================
     HERO SWIPER
  ========================================================= */
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  if (slides.length) {
    slides.forEach((s, i) => s.classList.toggle("active", i === 0));

    setInterval(() => {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("active");
    }, 4000);
  }

  /* =========================================================
     DATA
  ========================================================= */
  let products = [];
  let categories = [];

  const productContainer = document.getElementById("products");
  const categoryContainer = document.getElementById("categoryBar");

  /* =========================================================
     WHATSAPP
  ========================================================= */
  window.buyProduct = function (name) {
    const msg = `Hola, quiero comprar: ${name}`;
    window.open(
      `https://wa.me/573001455979?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  /* =========================================================
     LOAD JSON
  ========================================================= */
  try {
    const [pRes, cRes] = await Promise.all([
      fetch("productos.json"),
      fetch("categorias.json")
    ]);

    products = await pRes.json();
    categories = await cRes.json();

  } catch (err) {
    console.error("Error cargando JSON:", err);
    products = [];
    categories = [];
  }

  /* =========================================================
     RENDER CATEGORÍAS (INDEX -> REDIRECCIÓN)
  ========================================================= */
  function renderCategoriesIndex() {
    if (!categoryContainer) return;

    categoryContainer.innerHTML = "";

    categories.forEach((c) => {
      const name = c.name || "Categoria";
      const slug = (c.slug || name)
        .toLowerCase()
        .replace(/\s+/g, "-");

      const card = document.createElement("div");
      card.className = "cat-card";

      card.innerHTML = `
        <img src="${c.image || ''}">
        <span>${name}</span>
      `;

      card.addEventListener("click", () => {
        window.location.href = `catalogo.html?cat=${slug}`;
      });

      categoryContainer.appendChild(card);
    });
  }

  /* =========================================================
     RENDER PRODUCTOS (INDEX)
  ========================================================= */
  function renderProducts(category = "all") {

    if (!productContainer) return;

    let data = products;

    if (category !== "all") {
      data = products.filter(p => p.category === category);
    }

    // detectar móvil
    const isMobile = window.innerWidth <= 768;

    // límite dinámico
    const limit = isMobile ? 8 : 10;

    data = data.slice(0, limit);

    productContainer.innerHTML = data.map(p => `
    <div class="product-card">
      <img src="${p.image}">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <button onclick="buyProduct('${p.name}')">
        <i class="bi bi-whatsapp"></i> Pedir por Whatsapp
      </button>
    </div>
  `).join("");
  }

  /* =========================================================
     INIT INDEX
  ========================================================= */
  renderCategoriesIndex();
  renderProducts("all");
}