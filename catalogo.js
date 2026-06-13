document.addEventListener("DOMContentLoaded", async () => {


    const toggle = document.getElementById("toggle");
    const nav = document.getElementById("nav");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            nav.classList.toggle("active");
        });
    }
    const productsEl = document.getElementById("products");
    const categoriesEl = document.getElementById("categories");
    const searchEl = document.getElementById("search");

    let products = [];

    const res = await fetch("productos.json");
    products = await res.json();

    /* =========================
       CATEGORÍAS DINÁMICAS
    ========================= */
    const categories = ["all", ...new Set(products.map(p => p.category))];

    categoriesEl.innerHTML = categories.map(cat => `
    <li data-cat="${cat}">${cat.toUpperCase()}</li>
  `).join("");

    let currentCategory = "all";

    function render() {

        let data = products;

        if (currentCategory !== "all") {
            data = data.filter(p => p.category === currentCategory);
        }

        const search = searchEl.value.toLowerCase();

        if (search) {
            data = data.filter(p =>
                p.name.toLowerCase().includes(search)
            );
        }

        productsEl.innerHTML = data.map(p => `
      <div class="product-card">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>

        <button onclick="buy('${p.name}')">
          <i class="bi bi-whatsapp"></i> Pedir por Whatsapp
        </button>
      </div>
    `).join("");
    }

    /* =========================
       CLICK CATEGORÍAS
    ========================= */
    categoriesEl.querySelectorAll("li").forEach(li => {
        li.addEventListener("click", () => {
            currentCategory = li.dataset.cat;
            render();
        });
    });

    /* =========================
       BUSCADOR
    ========================= */
    searchEl.addEventListener("input", render);

    /* INIT */
    render();

});

/* WHATSAPP */
function buy(name) {
    const msg = `Hola, quiero comprar: ${name}`;
    window.open(`https://wa.me/573001455979?text=${encodeURIComponent(msg)}`, "_blank");
}