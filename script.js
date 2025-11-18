/* ===============================
   BrewHaven — script.js
   Pairs with index.html & styles.css
   =============================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menu filtering (pills) ---------- */
  const pillButtons = document.querySelectorAll(".pillbar .pill");
  const menuItems   = document.querySelectorAll(".menu .item");

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

    // keyboard left/right to move between pills
    btn.addEventListener("keydown", (e) => {
      if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
      e.preventDefault();
      const buttonsArray = Array.from(pillButtons);
      const idx = buttonsArray.indexOf(btn);
      const nextIdx =
        e.key === "ArrowRight"
          ? (idx + 1) % buttonsArray.length
          : (idx - 1 + buttonsArray.length) % buttonsArray.length;
      buttonsArray[nextIdx].focus();
    });
  });

  // default to “hot”
  const defaultCat = "hot";
  const defaultBtn =
    Array.from(pillButtons).find(b => b.dataset.cat === defaultCat) ||
    pillButtons[0];
  if (defaultBtn) {
    setActivePill(defaultBtn);
    filterMenu(defaultCat);
  }

  /* ---------- Small helper for form messages ---------- */
  const setHelp = (el, msg = "", state = "") => {
    // state: "", "ok", "err"
    if (!el) return;
    el.textContent = msg;
    el.className = "helper" + (state ? ` ${state}` : "");
  };

  /* ---------- Reservation form ---------- */
  const rForm = document.getElementById("reservationForm");
  if (rForm) {
    const name   = document.getElementById("resName");
    const email  = document.getElementById("resEmail");
    const date   = document.getElementById("resDate");
    const time   = document.getElementById("resTime");
    const party  = document.getElementById("resParty");
    const notes  = document.getElementById("resNotes");
    const status = document.getElementById("resStatus");

    const help = {
      name:  document.getElementById("resNameHelp"),
      email: document.getElementById("resEmailHelp"),
      date:  document.getElementById("resDateHelp"),
      time:  document.getElementById("resTimeHelp"),
      party: document.getElementById("resPartyHelp"),
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

      setHelp(
        status,
        `${summary} We’ll confirm your reservation by email shortly.`,
        "ok"
      );

      rForm.reset();
      Object.values(help).forEach(h => setHelp(h, ""));
    });

    // Inline validation
    [name, email, date, time, party].forEach(input => {
      if (!input) return;
      input.addEventListener("blur", () => validateReservation());
    });
  }

  /* ---------- Contact form ---------- */
  const cForm  = document.getElementById("contactForm");
  if (cForm) {
    const cName   = document.getElementById("cName");
    const cEmail  = document.getElementById("cEmail");
    const cMsg    = document.getElementById("cMsg");
    const cStatus = document.getElementById("cStatus");

    const cHelp = {
      name:  document.getElementById("cNameHelp"),
      email: document.getElementById("cEmailHelp"),
      msg:   document.getElementById("cMsgHelp"),
    };

    function validateContact() {
      let valid = true;

      if (!cName.value.trim()) {
        setHelp(cHelp.name, "Your name is required.", "err");
        valid = false;
      } else setHelp(cHelp.name, "", "ok");

      if (!cEmail.checkValidity()) {
        setHelp(cHelp.email, "Enter a valid email.", "err");
        valid = false;
      } else setHelp(cHelp.email, "", "ok");

      if (!cMsg.value.trim() || cMsg.value.trim().length < 10) {
        setHelp(cHelp.msg, "Message must be at least 10 characters.", "err");
        valid = false;
      } else setHelp(cHelp.msg, "", "ok");

      return valid;
    }

    cForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!validateContact()) {
        setHelp(cStatus, "Please complete the required fields.", "err");
        return;
      }

      setHelp(
        cStatus,
        "Thanks for reaching out! We’ve received your message and will get back to you soon.",
        "ok"
      );

      console.log("Contact message:", {
        name: cName.value.trim(),
        email: cEmail.value.trim(),
        message: cMsg.value.trim(),
      });

      cForm.reset();
      Object.values(cHelp).forEach(h => setHelp(h, ""));
    });

    [cName, cEmail, cMsg].forEach(input => {
      input.addEventListener("blur", () => validateContact());
    });
  }

  /* ---------- Smooth skip for hash links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      setTimeout(() => target.setAttribute("tabindex", "-1"), 0);
      setTimeout(() => target.focus({ preventScroll: true }), 100);
    });
  });
});
