/* ====== CONFIGURACIÓN DE WHATSAPP (solo cambie estas dos líneas) ====== */
const WA_NUMBER = "573115339727"; /* 57 + celular de 10 dígitos, sin +, sin espacios */
const WA_MENSAJE = "Hola, quiero cotizar un transporte de carga con LOR ENVIOS S.A.S.";
/* ====================================================================== */
(function () {
  /* Menú plegable (celular) */
  var btn = document.querySelector(".menu-btn"), nav = document.getElementById("menu");
  if (btn && nav) {
    var cerrar = function () { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-label", "Abrir menú"); };
    btn.addEventListener("click", function () {
      var abierto = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", abierto ? "true" : "false");
      btn.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });
    nav.addEventListener("click", function (e) { if (e.target.tagName === "A") cerrar(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") cerrar(); });
  }
  /* Botones de WhatsApp */
  if (!/^\d{11,15}$/.test(WA_NUMBER)) return;
  var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(WA_MENSAJE);
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = url; a.target = "_blank"; a.rel = "noopener";
    if (a.hasAttribute("data-wa-text")) a.textContent = "+" + WA_NUMBER.replace(/^(\d{2})(\d{3})(\d{3})(\d+)$/, "$1 $2 $3 $4");
  });
})();

/* ===== Interacción ===== */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canIO = "IntersectionObserver" in window;

  /* Aparecer al hacer scroll */
  if (!reduce && canIO) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".head,.service,.cities li,.steps li,.photos figure,.fleet-box,.clients li,.stat,.tiles li,.slogan-grid div,.value,.map-grid,.quote-box").forEach(function (el) {
      var i = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.transitionDelay = Math.min(i, 5) * 80 + "ms";
      el.addEventListener("transitionend", function () { el.style.transitionDelay = ""; }, { once: true });
      el.classList.add("reveal"); io.observe(el);
    });
  }

  /* Cifras que cuentan */
  var nums = document.querySelectorAll("[data-count]");
  if (!reduce && canIO && nums.length) {
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io2.unobserve(e.target);
        var fin = +e.target.getAttribute("data-count"), t0 = null;
        (function paso(t) {
          if (t0 === null) t0 = t;
          var p = Math.min((t - t0) / 1200, 1);
          e.target.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(paso);
        })(performance.now());
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { n.textContent = "0"; io2.observe(n); });
  }

  /* Fotos que se amplían */
  var imgs = document.querySelectorAll(".photos img");
  if (imgs.length && window.HTMLDialogElement) {
    var d = document.createElement("dialog"); d.className = "lb";
    d.innerHTML = '<img alt=""><p></p><button type="button" aria-label="Cerrar">×</button>';
    document.body.appendChild(d);
    d.addEventListener("click", function (e) { if (e.target !== d.querySelector("img")) d.close(); });
    imgs.forEach(function (im) {
      im.tabIndex = 0; im.setAttribute("role", "button");
      var abrir = function () {
        var big = d.querySelector("img"); big.src = im.src; big.alt = im.alt;
        d.querySelector("p").textContent = im.nextElementSibling ? im.nextElementSibling.textContent : "";
        d.showModal();
      };
      im.addEventListener("click", abrir);
      im.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(); } });
    });
  }

  /* Mapa de rutas */
  var nodes = document.querySelectorAll(".node"), info = document.getElementById("map-info");
  if (nodes.length && info) {
    var INFO = {
      villavicencio: ["Villavicencio", "Sede principal y bodega, en el barrio San Marcos."],
      bogota: ["Bogotá", "Operación de LOR ENVIOS en Bogotá."],
      pereira: ["Pereira", "Operación de LOR ENVIOS en Pereira."],
      yopal: ["Yopal", "Operación de LOR ENVIOS en Yopal."],
      barranquilla: ["Barranquilla", "Operación de LOR ENVIOS en Barranquilla."],
      sincelejo: ["Sincelejo", "Operación de LOR ENVIOS en Sincelejo."]
    };
    var sel = function (c) {
      nodes.forEach(function (n) { n.classList.toggle("on", n.getAttribute("data-city") === c); });
      document.querySelectorAll(".route").forEach(function (r) { r.classList.toggle("on", r.getAttribute("data-city") === c); });
      info.querySelector("h3").textContent = INFO[c][0]; info.querySelector("p").textContent = INFO[c][1];
    };
    nodes.forEach(function (n) {
      ["mouseenter", "focus", "click"].forEach(function (ev) { n.addEventListener(ev, function () { sel(n.getAttribute("data-city")); }); });
    });
    if (reduce) document.querySelectorAll("animateMotion,animate").forEach(function (a) { a.remove(); });
  }

  /* Formulario de cotización -> WhatsApp */
  var f = document.getElementById("cotizar-form");
  if (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var g = function (n) { return (f.elements[n].value || "").trim(); };
      var m = "Hola, quiero cotizar un transporte de carga con LOR ENVIOS S.A.S.\n" +
        (g("nombre") ? "Nombre: " + g("nombre") + "\n" : "") +
        "Origen: " + g("origen") + "\nDestino: " + g("destino") + "\nTipo de carga: " + g("carga") +
        (g("detalles") ? "\nDetalles: " + g("detalles") : "");
      window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(m), "_blank", "noopener");
    });
  }
})();
