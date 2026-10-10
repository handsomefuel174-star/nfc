(function () {
  "use strict";
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  /* ---------- WhatsApp + precios ---------- */
  var WHATSAPP_NUMBER = "595994533990";
  function whatsappUrl(message) { return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message); }
  var BASE_PRICE = 150000, MAX_QTY = 50;
  var TIERS = [{ from: 1, price: 150000 }, { from: 3, price: 125000 }, { from: 7, price: 100000 }, { from: 15, price: 75000 }];
  function tierIndex(q) { for (var i = TIERS.length - 1; i >= 0; i--) if (q >= TIERS[i].from) return i; return 0; }
  function unitPrice(q) { return TIERS[tierIndex(q)].price; }
  function total(q) { return q <= 0 ? 0 : unitPrice(q) * q; }
  function savings(q) { return q <= 0 ? 0 : BASE_PRICE * q - total(q); }
  function nextTier(q) { var n = TIERS[tierIndex(q) + 1]; return n ? { missing: n.from - q, price: n.price } : null; }
  function formatGs(v) { return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " Gs"; }

  /* ---------- Scroll suave (Lenis) ---------- */
  var lenis = null;
  if (!reduced && window.Lenis) {
    try { lenis = new window.Lenis({ duration: 1.05, smoothWheel: true, anchors: { offset: -90 } }); } catch (e) { lenis = null; }
  }

  /* ---------- Menú móvil ---------- */
  var nav = document.getElementById("nav-links");
  var toggle = document.getElementById("menu-toggle");
  function setMenu(open) {
    nav.classList.toggle("mobile-open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }
  toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("mobile-open")); });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });

  /* ---------- Animaciones de entrada ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Inclinación con el ratón ---------- */
  function lerp(a, b, t) { return a + (b - a) * t; }
  var scene = document.getElementById("nfc-scene");
  var card = document.getElementById("hero-card");
  var phone = document.getElementById("hero-phone");
  var heroTilt = { x: 0, y: 0, tx: 0, ty: 0 };
  if (!reduced) {
    scene.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      var box = scene.getBoundingClientRect();
      heroTilt.ty = (e.clientX - box.left - box.width / 2) / 24;
      heroTilt.tx = -(e.clientY - box.top - box.height / 2) / 24;
    });
    scene.addEventListener("pointerleave", function () { heroTilt.tx = 0; heroTilt.ty = 0; });
  }

  var tilts = [];
  document.querySelectorAll("[data-tilt]").forEach(function (el) {
    var t = { el: el, x: 0, y: 0, tx: 0, ty: 0 };
    tilts.push(t);
    if (reduced) return;
    el.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      var r = el.getBoundingClientRect();
      t.ty = (e.clientX - r.left - r.width / 2) / 30;
      t.tx = -(e.clientY - r.top - r.height / 2) / 30;
    });
    el.addEventListener("pointerleave", function () { t.tx = 0; t.ty = 0; });
  });

  /* ---------- Efectos ligados al scroll ---------- */
  var progressBar = document.getElementById("scroll-progress");
  var navbar = document.getElementById("navbar");
  var fab = document.getElementById("wa-fab");
  var ribbon = document.getElementById("ribbon");
  var ribbonTrack = document.getElementById("ribbon-track");
  var wasScrolled = null, fabShown = null;

  // Progreso de un elemento a través de la ventana: 0 cuando entra por abajo, 1 cuando sale por arriba.
  function elementProgress(el) {
    var r = el.getBoundingClientRect(), vh = window.innerHeight;
    var p = (vh - r.top) / (vh + r.height);
    return p < 0 ? 0 : p > 1 ? 1 : p;
  }

  function update() {
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";

    var scrolled = y > 20;
    if (scrolled !== wasScrolled) { navbar.classList.toggle("scrolled", scrolled); wasScrolled = scrolled; }
    var showFab = y > 500;
    if (showFab !== fabShown) { fab.classList.toggle("visible", showFab); fab.tabIndex = showFab ? 0 : -1; fabShown = showFab; }

    if (reduced) return;

    var p = elementProgress(scene);
    heroTilt.x = lerp(heroTilt.x, heroTilt.tx, 0.12);
    heroTilt.y = lerp(heroTilt.y, heroTilt.ty, 0.12);
    card.style.transform = "translateY(" + (35 - 100 * p).toFixed(2) + "px) rotateZ(" + (-13 + 24 * p).toFixed(2) + "deg) rotateX(" + heroTilt.x.toFixed(2) + "deg) rotateY(" + heroTilt.y.toFixed(2) + "deg)";
    phone.style.transform = "translateY(" + (15 - 40 * p).toFixed(2) + "px) rotate(12deg)";

    ribbonTrack.style.transform = "translateX(" + (80 - 300 * elementProgress(ribbon)).toFixed(2) + "px)";

    for (var i = 0; i < tilts.length; i++) {
      var t = tilts[i];
      t.x = lerp(t.x, t.tx, 0.15); t.y = lerp(t.y, t.ty, 0.15);
      t.el.style.transform = Math.abs(t.x) + Math.abs(t.y) < 0.01 ? "" : "perspective(800px) rotateX(" + t.x.toFixed(2) + "deg) rotateY(" + t.y.toFixed(2) + "deg)";
    }
  }

  function frame(time) {
    if (lenis) lenis.raf(time);
    update();
    requestAnimationFrame(frame);
  }
  if (reduced) card.style.transform = "rotate(-8deg)";
  requestAnimationFrame(frame);

  /* ---------- Configurador de cantidades ---------- */
  var rows = Array.prototype.map.call(document.querySelectorAll(".config-row"), function (el) {
    return {
      el: el,
      name: el.getAttribute("data-name"),
      plural: el.getAttribute("data-plural"),
      range: el.querySelector(".tap-range"),
      num: el.querySelector(".qty-num"),
      minus: el.querySelector('[data-step="-1"]'),
      plus: el.querySelector('[data-step="1"]'),
      marks: el.querySelectorAll(".slider-marks span"),
      hint: el.querySelector(".row-hint"),
      unit: el.querySelector(".row-unit"),
      total: el.querySelector(".row-total"),
      saving: el.querySelector(".saving"),
      order: el.querySelector(".row-order"),
      lastUnit: null,
      qty: parseInt(el.querySelector(".tap-range").value, 10) || 0
    };
  });
  var summaryList = document.getElementById("summary-list");
  var grandTotal = document.getElementById("grand-total");
  var orderAll = document.getElementById("order-all");

  function label(r, q) { return q + " " + (q === 1 ? r.name : r.plural); }
  function line(r, q) { return label(r, q) + " (" + formatGs(unitPrice(q)) + "/und, total " + formatGs(total(q)) + ")"; }
  function setLink(a, href) {
    if (href) { a.href = href; a.removeAttribute("aria-disabled"); a.classList.remove("is-disabled"); a.removeAttribute("tabindex"); }
    else { a.removeAttribute("href"); a.setAttribute("aria-disabled", "true"); a.classList.add("is-disabled"); a.setAttribute("tabindex", "-1"); }
  }

  function renderRow(r) {
    var q = r.qty, tier = tierIndex(Math.max(q, 1)), next = q > 0 ? nextTier(q) : null, save = savings(q);
    r.range.value = q;
    r.range.style.setProperty("--fill", (q / MAX_QTY) * 100 + "%");
    r.range.setAttribute("aria-valuetext", q + " unidades");
    r.num.textContent = q;
    r.minus.disabled = q <= 0;
    r.plus.disabled = q >= MAX_QTY;
    r.el.classList.toggle("is-empty", q === 0);
    r.marks.forEach(function (m, i) { m.classList.toggle("active", i === tier && q > 0); });
    r.hint.textContent = q === 0 ? "Desliza para agregar esta tarjeta." : next ? "Agrega " + next.missing + " más y paga " + formatGs(next.price) + " por unidad" : "Mejor precio";
    var unit = unitPrice(Math.max(q, 1));
    r.unit.textContent = formatGs(unit) + " / und";
    if (r.lastUnit !== null && r.lastUnit !== unit && !reduced) {
      r.unit.classList.remove("bump"); void r.unit.offsetWidth; r.unit.classList.add("bump");
    }
    r.lastUnit = unit;
    r.total.textContent = formatGs(total(q));
    r.saving.textContent = save > 0 ? "Ahorras " + formatGs(save) : " ";
    setLink(r.order, q > 0 ? whatsappUrl("Hola TAPJR! Quiero pedir " + line(r, q) + ".") : null);
  }

  function renderSummary() {
    var selected = rows.filter(function (r) { return r.qty > 0; });
    var grand = selected.reduce(function (s, r) { return s + total(r.qty); }, 0);
    summaryList.innerHTML = "";
    if (!selected.length) {
      var empty = document.createElement("li"); empty.textContent = "Elige al menos una tarjeta."; summaryList.appendChild(empty);
    }
    selected.forEach(function (r) {
      var li = document.createElement("li"), span = document.createElement("span");
      li.textContent = label(r, r.qty) + " ";
      span.textContent = formatGs(total(r.qty));
      li.appendChild(span); summaryList.appendChild(li);
    });
    grandTotal.textContent = formatGs(grand);
    var msg = "Hola TAPJR! Quiero hacer este pedido:\n" + selected.map(function (r) { return "- " + line(r, r.qty); }).join("\n") + "\nTotal general: " + formatGs(grand) + ".";
    setLink(orderAll, selected.length ? whatsappUrl(msg) : null);
  }

  function setQty(r, v) {
    r.qty = Math.max(0, Math.min(MAX_QTY, v | 0));
    renderRow(r);
    renderSummary();
  }

  rows.forEach(function (r) {
    r.range.addEventListener("input", function () { setQty(r, parseInt(r.range.value, 10)); });
    // Arrastre propio (ratón y táctil): el valor sigue al dedo y un toque en la pista salta a ese punto.
    function valueAt(x) {
      var b = r.range.getBoundingClientRect(), f = (x - b.left - 10) / (b.width - 20);
      return Math.round(Math.max(0, Math.min(1, f)) * MAX_QTY);
    }
    r.range.addEventListener("pointerdown", function (e) {
      if (e.button > 0) return;
      e.preventDefault();
      r.range.focus({ preventScroll: true });
      try { r.range.setPointerCapture(e.pointerId); } catch (err) {}
      r.dragging = true;
      setQty(r, valueAt(e.clientX));
    });
    r.range.addEventListener("pointermove", function (e) { if (r.dragging) setQty(r, valueAt(e.clientX)); });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (type) {
      r.range.addEventListener(type, function () { r.dragging = false; });
    });
    r.minus.addEventListener("click", function () { setQty(r, r.qty - 1); });
    r.plus.addEventListener("click", function () { setQty(r, r.qty + 1); });
    r.marks.forEach(function (m) {
      var v = parseInt(m.getAttribute("data-m"), 10);
      // Alinea cada marca con la posición real del centro del thumb (20px de ancho).
      m.style.left = "calc(10px + (100% - 20px) * " + (v / MAX_QTY) + ")";
    });
    renderRow(r);
  });
  renderSummary();
})();
