/* Minimal progressive enhancement. The site works with JS disabled;
   this only adds the mobile nav toggle and the footer year. */
(function () {
  "use strict";

  // --- current year in the footer ------------------------------------------
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  // --- mobile nav toggle --------------------------------------------------
  var toggle = document.querySelector(".nav__toggle");
  var list = document.getElementById("nav-list");

  if (toggle && list) {
    toggle.addEventListener("click", function () {
      var open = list.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    // close after tapping a link
    list.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        list.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    // close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && list.classList.contains("is-open")) {
        list.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }
})();
