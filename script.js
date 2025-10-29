/* ===============================
   BrewHaven — script.js
   Pairs with index.html & styles.css
   =============================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Utils ---------- */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Footer year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menu filtering (pills) ---------- */
  const pillButtons = $$(".pillbar .pill");
  const menuItems   = $$(".menu .item");

  function setActivePill(btn) {
    pillButtons.forEach(b => b.setAttribute("aria-pressed", "false"));
    btn.setAttribute("aria-pressed", "true");
  }

  function filterMenu(cat) {
    menuItems.forEach(it => {
      const show = cat === "all" || it.dataset.cat === cat;
      it.style.display = show ? "" : "none";
    });
  }

  pillButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      setActivePill(btn);
      filterMenu(btn.dataset.cat);
    });

    // Allow arrow key navigation between pills
    btn.addEventListener("keydown", (e) => {
      if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
      e.preventDefault();
      const idx = pillButtons.indexOf ? pillButtons.indexOf(btn) : pillButtons.findIndex(b => b === btn);
      const nextIdx = e.key === "ArrowRight"
        ? (idx + 1) % pillButtons.length
        : (idx - 1 + pillButtons.length) % pillButtons.length;
      pillButtons[nextIdx].focus();
    });
  });

  /* ---------- Forms: helpers ---------- */
  const setHelp = (el, msg = "", state = "") => {
    // state: "", "ok", "err"
    if (!el) return;
    el.textContent = msg;
    el.className = "helper" + (state ? ` ${state}` : "");
  };

  /* ---------- Reservation form ---------- */
  const rForm = $("#reservationForm");
  if (rForm) {
    const name   = $("#resName");
    const email  = $("#resEmail");
    const date   = $("#resDate");
    const time   = $("#resTime");
    const party  = $("#resParty");
    const notes  = $("#resNotes");
    const status = $("#resStatus");

    const help = {
      name:  $("#resNameHelp"),
      email: $("#resEmailHelp"),
      date:  $("#resDateHelp"),
      time:  $("#resTimeHelp"),
      party: $("#resPartyHelp"),
    };

    // Prevent past dates
    if (date) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      date.min = `${yyyy}-${mm}-${dd}`;
    }

    function validateReservation() {
      let valid = true;

      if (!name.value.trim() || name.value.trim().length < 2) {
        setHelp(help.name, "Please enter your full name.", "err");
        valid = false;
      } else setHelp(help.name, "Looks good!", "ok");

      if (!email.checkValidity()) {
        setHelp(help.email, "Enter a valid email.", "err");
        valid = false;
      } else setHelp(help.email, "✓", "ok");

      if (!date.value) {
        setHelp(help.date, "Pick a date.", "err");
        valid = false;
      } else setHelp(help.date, "", "ok");

      if (!time.value) {
        setHelp(help.time, "Pick a time.", "err");
        valid = false;
      } else setHelp(help.time, "", "ok");

      if (!party.value) {
        setHelp(help.party, "Select party size.", "err");
        valid = false;
      } else setHelp(help.party, "", "ok");

      return valid;
    }

    rForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateReservation()) {
        setHelp(status, "Please fix the highlighted fields.", "err");
        return;
      }

      const summary =
        `Reservation requested for ${name.value.trim()} (${email.value.trim()}) ` +
        `on ${date.value} at ${time.value} for ${party.value}.` +
        (notes.value.trim() ? ` Notes: ${notes.value.trim()}` : "");

      setHelp(status, `${summary} We’ll confirm by email shortly.`, "ok");
      rForm.reset();

      // Clear helper states after reset
      Object.values(help).forEach(h => setHelp(h, ""));
    });

    // Inline validation on blur for better UX
    [name, email, date, time, party].forEach(input => {
      if (!input) return;
      input.addEventListener("blur", () => validateReservation());
    });
  }

  /* ---------- Contact form ---------- */
  const cForm = $("#contactForm");
  if (cForm) {
    const name   = $("#cName");
    const email  = $("#cEmail");
    const msg    = $("#cMsg");
    const status = $("#cStatus");

    const help = {
      name:  $("#cNameHelp"),
      email: $("#cEmailHelp"),
      msg:   $("#cMsgHelp"),
    };

    function validateContact() {
      let valid = true;

      if (!name.value.trim()) {
        setHelp(help.name, "Your name is required.", "err");
        valid = false;
      } else setHelp(help.name, "", "ok");

      if (!email.checkValidity()) {
        setHelp(help.email, "Enter a valid email.", "err");
        valid = false;
      } else setHelp(help.email, "", "ok");

      if (!msg.value.trim() || msg.value.trim().length < 10) {
        setHelp(help.msg, "Message must be at least 10 characters.", "err");
        valid = false;
      } else setHelp(help.msg, "", "ok");

      return valid;
    }

    cForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateContact()) {
        setHelp(status, "Please complete the required fields.", "err");
        return;
      }
      setHelp(status, "Thanks! We’ve received your message and will get back soon.", "ok");
      cForm.reset();
      Object.values(help).forEach(h => setHelp(h, ""));
    });

    [name, email, msg].forEach(input => {
      input.addEventListener("blur", () => validateContact());
    });
  }

  /* ---------- Smooth skip for hash links on older browsers ---------- */
  // (Modern browsers already do smooth via CSS, this just ensures focus lands on target)
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      // Allow default scroll, then move focus for accessibility
      setTimeout(() => target.setAttribute("tabindex", "-1"), 0);
      setTimeout(() => target.focus({ preventScroll: true }), 100);
    });
  });
});
