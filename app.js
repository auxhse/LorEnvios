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
          e.target.textContent = (e.target.getAttribute("data-prefix") || "") + Math.round(fin * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(paso);
        })(performance.now());
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { n.textContent = (n.getAttribute("data-prefix") || "") + "0"; io2.observe(n); });
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

/* ===== Camión de "Cómo funciona" ===== */
(function () {
  var w = document.querySelector(".steps-wrap");
  if (!w) return;
  var pasos = w.querySelectorAll(".steps li");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, espera = false;
  var valor = 0, lanzado = false;
  var intro = function () {
    if (!lanzado) {
      lanzado = true;
      var t0 = performance.now();
      (function f(t) { valor = Math.min(1, (t - t0) / 2400); poner(); if (valor < 1) requestAnimationFrame(f); })(t0);
    }
    return valor;
  };
  var poner = function () {
    var r = w.getBoundingClientRect(), vh = window.innerHeight, y = window.scrollY;
    var top = r.top + y, bottom = r.bottom + y;
    var max = document.documentElement.scrollHeight - vh;
    var ini = top - vh * 0.9;
    var fin = Math.min(bottom - vh * 0.55, max - 2);
    var p;
    if (reduce) p = 1;
    else if (fin <= ini) p = r.top < vh ? intro() : 0;
    else p = Math.min(1, Math.max(0, (y - ini) / (fin - ini)));
    if (!reduce && p >= 1 && y < 5 && r.top < vh) p = intro();
    w.style.setProperty("--p", p.toFixed(3));
    pasos.forEach(function (li, i) { li.classList.toggle("on", p >= i / 3 - 0.02); });
  };
  var tick = function () { if (!espera) { espera = true; requestAnimationFrame(function () { espera = false; poner(); }); } };
  window.addEventListener("scroll", tick, { passive: true });
  window.addEventListener("resize", tick);
  window.addEventListener("load", poner);
  poner();
})();

/* ===== Simulador y buscador de ciudades ===== */
(function () {
  var svg = document.querySelector(".map-svg");
  if (!svg) return;
  var CIU = { villavicencio: "Villavicencio", bogota: "Bogotá", pereira: "Pereira", yopal: "Yopal", barranquilla: "Barranquilla", sincelejo: "Sincelejo" };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EXTRA = { arauca: "Arauca", neiva: "Neiva", ibague: "Ibagué" }, EXTRA_K = Object.keys(EXTRA);
  var pos = {};
  svg.querySelectorAll(".node").forEach(function (n) {
    var c = n.querySelector("circle.dot"); pos[n.getAttribute("data-city")] = [+c.getAttribute("cx"), +c.getAttribute("cy")];
  });
  var wa = function (txt) { return /^\d{11,15}$/.test(WA_NUMBER) ? "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(txt) : "contacto.html"; };
  var abrir = function (a, url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; };

  /* Llegar desde el inicio con una ciudad: operaciones.html#bogota */
  var hc = (location.hash || "").slice(1);
  if (CIU[hc]) {
    var nh = svg.querySelector('.node[data-city="' + hc + '"]');
    if (nh) { nh.dispatchEvent(new Event("click")); var rr = document.getElementById("rutas"); if (rr) rr.scrollIntoView(); }
  }

  /* ¿Operamos en tu ciudad? */
  var chk = document.getElementById("chk"), cm = document.getElementById("chk-msg"), cw = document.getElementById("chk-wa");
  if (chk) chk.addEventListener("input", function () {
    var v = chk.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    cw.hidden = true; cm.textContent = "";
    if (!v) return;
    var m = Object.keys(CIU).filter(function (k) { return k.indexOf(v) === 0; });
    if (m.length === 1 && v.length >= 2) {
      cm.textContent = "Sí, operamos en " + CIU[m[0]] + ".";
      var n = svg.querySelector('.node[data-city="' + m[0] + '"]'); if (n) n.dispatchEvent(new Event("click"));
    } else if (!m.length && v.length >= 2 && EXTRA_K.filter(function (k) { return k.indexOf(v) === 0; }).length === 1) {
      var ek = EXTRA_K.filter(function (k) { return k.indexOf(v) === 0; })[0];
      cm.textContent = "También hemos trabajado en " + EXTRA[ek] + ". Escríbenos para cotizar.";
      cw.hidden = false; abrir(cw, wa("Hola, quisiera cotizar un transporte de carga en " + EXTRA[ek] + " con LOR ENVIOS S.A.S."));
    } else if (!m.length && v.length >= 4) {
      cm.textContent = "Esa ciudad no está en nuestro mapa. Escríbenos y lo revisamos.";
      cw.hidden = false; abrir(cw, wa("Hola, quisiera saber si pueden transportar carga en " + chk.value.trim() + " con LOR ENVIOS S.A.S."));
    }
  });

  /* Simula tu ruta */
  var so = document.getElementById("sim-o"), sd = document.getElementById("sim-d"), sm = document.getElementById("sim-msg"), sb = document.getElementById("sim-wa");
  var path = document.getElementById("sim-route"), truck = document.getElementById("sim-truck"), raf = null;
  if (!so || !sd || !path) return;
  var parar = function () {
    if (raf) cancelAnimationFrame(raf); raf = null;
    path.style.display = "none"; truck.style.display = "none"; svg.classList.remove("sim-on");
    sb.classList.add("off"); sb.removeAttribute("href");
  };
  var correr = function () {
    parar();
    var o = so.value, d = sd.value;
    if (!o || !d) { sm.textContent = "Elige origen y destino."; return; }
    if (o === d) { sm.textContent = "Elige dos ciudades distintas."; return; }
    var a = pos[o], b = pos[d], dx = b[0] - a[0], dy = b[1] - a[1];
    var qx = (a[0] + b[0]) / 2 - dy * 0.22, qy = (a[1] + b[1]) / 2 + dx * 0.22;
    path.setAttribute("d", "M" + a[0] + "," + a[1] + " Q" + qx + "," + qy + " " + b[0] + "," + b[1]);
    path.style.display = ""; truck.style.display = ""; svg.classList.add("sim-on");
    svg.querySelectorAll(".node").forEach(function (n) { var c = n.getAttribute("data-city"); n.classList.toggle("on", c === o || c === d); });
    sm.textContent = CIU[o] + " → " + CIU[d] + ". Pide tu cotización por WhatsApp.";
    sb.classList.remove("off");
    abrir(sb, wa("Hola, quiero cotizar un transporte de carga con LOR ENVIOS S.A.S.\nOrigen: " + CIU[o] + "\nDestino: " + CIU[d]));
    var L = path.getTotalLength();
    if (reduce) { var e = path.getPointAtLength(L); truck.setAttribute("cx", e.x); truck.setAttribute("cy", e.y); return; }
    var t0 = null;
    (function paso(t) {
      if (t0 === null) t0 = t;
      var pt = path.getPointAtLength(L * (((t - t0) % 2600) / 2600));
      truck.setAttribute("cx", pt.x); truck.setAttribute("cy", pt.y);
      raf = requestAnimationFrame(paso);
    })(performance.now());
  };
  so.addEventListener("change", correr); sd.addEventListener("change", correr);
})();
/* ====== CONFIGURACIÓN DE WHATSAPP (solo cambie estas dos líneas) ====== */
const WA_NUMBER = "573184936998"; /* 57 + celular de 10 dígitos, sin +, sin espacios */
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
          e.target.textContent = (e.target.getAttribute("data-prefix") || "") + Math.round(fin * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(paso);
        })(performance.now());
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { n.textContent = (n.getAttribute("data-prefix") || "") + "0"; io2.observe(n); });
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

/* ===== Camión de "Cómo funciona" ===== */
(function () {
  var w = document.querySelector(".steps-wrap");
  if (!w) return;
  var pasos = w.querySelectorAll(".steps li");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, espera = false;
  var valor = 0, lanzado = false;
  var intro = function () {
    if (!lanzado) {
      lanzado = true;
      var t0 = performance.now();
      (function f(t) { valor = Math.min(1, (t - t0) / 2400); poner(); if (valor < 1) requestAnimationFrame(f); })(t0);
    }
    return valor;
  };
  var poner = function () {
    var r = w.getBoundingClientRect(), vh = window.innerHeight, y = window.scrollY;
    var top = r.top + y, bottom = r.bottom + y;
    var max = document.documentElement.scrollHeight - vh;
    var ini = top - vh * 0.9;
    var fin = Math.min(bottom - vh * 0.55, max - 2);
    var p;
    if (reduce) p = 1;
    else if (fin <= ini) p = r.top < vh ? intro() : 0;
    else p = Math.min(1, Math.max(0, (y - ini) / (fin - ini)));
    if (!reduce && p >= 1 && y < 5 && r.top < vh) p = intro();
    w.style.setProperty("--p", p.toFixed(3));
    pasos.forEach(function (li, i) { li.classList.toggle("on", p >= i / 3 - 0.02); });
  };
  var tick = function () { if (!espera) { espera = true; requestAnimationFrame(function () { espera = false; poner(); }); } };
  window.addEventListener("scroll", tick, { passive: true });
  window.addEventListener("resize", tick);
  window.addEventListener("load", poner);
  poner();
})();

/* ===== Simulador y buscador de ciudades ===== */
(function () {
  var svg = document.querySelector(".map-svg");
  if (!svg) return;
  var CIU = { villavicencio: "Villavicencio", bogota: "Bogotá", pereira: "Pereira", yopal: "Yopal", barranquilla: "Barranquilla", sincelejo: "Sincelejo" };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EXTRA = { arauca: "Arauca", neiva: "Neiva", ibague: "Ibagué" }, EXTRA_K = Object.keys(EXTRA);
  var pos = {};
  svg.querySelectorAll(".node").forEach(function (n) {
    var c = n.querySelector("circle.dot"); pos[n.getAttribute("data-city")] = [+c.getAttribute("cx"), +c.getAttribute("cy")];
  });
  var wa = function (txt) { return /^\d{11,15}$/.test(WA_NUMBER) ? "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(txt) : "contacto.html"; };
  var abrir = function (a, url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; };

  /* Llegar desde el inicio con una ciudad: operaciones.html#bogota */
  var hc = (location.hash || "").slice(1);
  if (CIU[hc]) {
    var nh = svg.querySelector('.node[data-city="' + hc + '"]');
    if (nh) { nh.dispatchEvent(new Event("click")); var rr = document.getElementById("rutas"); if (rr) rr.scrollIntoView(); }
  }

  /* ¿Operamos en tu ciudad? */
  var chk = document.getElementById("chk"), cm = document.getElementById("chk-msg"), cw = document.getElementById("chk-wa");
  if (chk) chk.addEventListener("input", function () {
    var v = chk.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    cw.hidden = true; cm.textContent = "";
    if (!v) return;
    var m = Object.keys(CIU).filter(function (k) { return k.indexOf(v) === 0; });
    if (m.length === 1 && v.length >= 2) {
      cm.textContent = "Sí, operamos en " + CIU[m[0]] + ".";
      var n = svg.querySelector('.node[data-city="' + m[0] + '"]'); if (n) n.dispatchEvent(new Event("click"));
    } else if (!m.length && v.length >= 2 && EXTRA_K.filter(function (k) { return k.indexOf(v) === 0; }).length === 1) {
      var ek = EXTRA_K.filter(function (k) { return k.indexOf(v) === 0; })[0];
      cm.textContent = "También hemos trabajado en " + EXTRA[ek] + ". Escríbenos para cotizar.";
      cw.hidden = false; abrir(cw, wa("Hola, quisiera cotizar un transporte de carga en " + EXTRA[ek] + " con LOR ENVIOS S.A.S."));
    } else if (!m.length && v.length >= 4) {
      cm.textContent = "Esa ciudad no está en nuestro mapa. Escríbenos y lo revisamos.";
      cw.hidden = false; abrir(cw, wa("Hola, quisiera saber si pueden transportar carga en " + chk.value.trim() + " con LOR ENVIOS S.A.S."));
    }
  });

  /* Simula tu ruta */
  var so = document.getElementById("sim-o"), sd = document.getElementById("sim-d"), sm = document.getElementById("sim-msg"), sb = document.getElementById("sim-wa");
  var path = document.getElementById("sim-route"), truck = document.getElementById("sim-truck"), raf = null;
  if (!so || !sd || !path) return;
  var parar = function () {
    if (raf) cancelAnimationFrame(raf); raf = null;
    path.style.display = "none"; truck.style.display = "none"; svg.classList.remove("sim-on");
    sb.classList.add("off"); sb.removeAttribute("href");
  };
  var correr = function () {
    parar();
    var o = so.value, d = sd.value;
    if (!o || !d) { sm.textContent = "Elige origen y destino."; return; }
    if (o === d) { sm.textContent = "Elige dos ciudades distintas."; return; }
    var a = pos[o], b = pos[d], dx = b[0] - a[0], dy = b[1] - a[1];
    var qx = (a[0] + b[0]) / 2 - dy * 0.22, qy = (a[1] + b[1]) / 2 + dx * 0.22;
    path.setAttribute("d", "M" + a[0] + "," + a[1] + " Q" + qx + "," + qy + " " + b[0] + "," + b[1]);
    path.style.display = ""; truck.style.display = ""; svg.classList.add("sim-on");
    svg.querySelectorAll(".node").forEach(function (n) { var c = n.getAttribute("data-city"); n.classList.toggle("on", c === o || c === d); });
    sm.textContent = CIU[o] + " → " + CIU[d] + ". Pide tu cotización por WhatsApp.";
    sb.classList.remove("off");
    abrir(sb, wa("Hola, quiero cotizar un transporte de carga con LOR ENVIOS S.A.S.\nOrigen: " + CIU[o] + "\nDestino: " + CIU[d]));
    var L = path.getTotalLength();
    if (reduce) { var e = path.getPointAtLength(L); truck.setAttribute("cx", e.x); truck.setAttribute("cy", e.y); return; }
    var t0 = null;
    (function paso(t) {
      if (t0 === null) t0 = t;
      var pt = path.getPointAtLength(L * (((t - t0) % 2600) / 2600));
      truck.setAttribute("cx", pt.x); truck.setAttribute("cy", pt.y);
      raf = requestAnimationFrame(paso);
    })(performance.now());
  };
  so.addEventListener("change", correr); sd.addEventListener("change", correr);
})();
