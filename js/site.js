(function () {
  const page = document.body.dataset.page || "";
  const THEME_KEY = "dropwell-theme";
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const getTheme = () => {
    if (location.hash === "#dark") return "dark";
    if (location.hash === "#light") return "light";
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") return saved;
    } catch (_) {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#121018" : "#f3efe6");
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      const dark = theme === "dark";
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    });
  };

  const themeButton = `
          <button class="theme-toggle" type="button" aria-pressed="false" aria-label="Switch to dark mode">
            <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z"/></svg>
            <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
          </button>`;

  const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 248 36" role="img" aria-hidden="true"><rect x="1.5" y="8" width="20" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="6" y="2" width="6" height="6" rx="1" fill="#C6FF3D"/><rect x="11" y="9" width="6" height="6" rx="1" fill="#6D4AFF"/><text x="30" y="26" font-family="Arial Black, Helvetica, sans-serif" font-size="20" font-weight="800" letter-spacing="1.5" fill="currentColor">DROPWELL</text></svg>`;

  const nav = [
    { href: "about.html", label: "About", id: "about" },
    { href: "community.html", label: "Community", id: "life" },
    { href: "news.html", label: "News", id: "news" },
    { href: "products.html", label: "Shop", id: "products" },
  ];

  const socialSvg = {
    instagram: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14.7 10.3 22 2h-2.2l-6.3 7.1L8.3 2H2l7.8 11.1L2 22h2.2l6.8-7.7L15.6 22H22l-7.3-11.7Zm-2.4 2.7-.8-1.1L5.1 3.5h2.6l5.1 7.2.8 1.1 6.7 9.6h-2.6l-5.4-7.4Z"/></svg>',
    facebook: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1Z"/></svg>',
    youtube: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12.2s0-3.3-.4-4.7c-.2-.9-.9-1.6-1.8-1.8C19.2 5.3 12 5.3 12 5.3s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 8.9 1 12.2 1 12.2s0 3.3.4 4.7c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.7.4-4.7ZM9.8 15.6V8.8l6.2 3.4-6.2 3.4Z"/></svg>',
  };

  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML = `
      <header class="site-header">
        <a class="brand" href="index.html" aria-label="Dropwell home">
          ${logo}
        </a>
        <nav class="nav-desktop" aria-label="Primary">
          ${nav
            .map(
              (item) =>
                `<a href="${item.href}"${page === item.id ? ' aria-current="page"' : ""}>${item.label}</a>`
            )
            .join("")}
        </nav>
        <div class="header-cta">
          ${themeButton}
          <a class="btn btn-play" href="play.html"${page === "play" ? ' aria-current="page"' : ""}><span class="label-full">Play</span><span class="label-short">Play</span></a>
          <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false"><span></span></button>
        </div>
      </header>
      <nav class="nav-mobile" aria-label="Mobile">
        ${nav.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}
        <a href="play.html">Play</a>
      </nav>
    `;

    const bar = header.querySelector(".site-header");
    const toggle = header.querySelector(".menu-toggle");
    const mobile = header.querySelector(".nav-mobile");
    const setOpen = (open) => {
      bar.classList.toggle("is-open", open);
      mobile.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", () => setOpen(!bar.classList.contains("is-open")));
    mobile.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  applyTheme(getTheme());
  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (_) {}
      applyTheme(next);
      if (location.hash === "#dark" || location.hash === "#light") {
        history.replaceState(null, "", location.pathname + location.search);
      }
    });
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    try {
      if (localStorage.getItem(THEME_KEY)) return;
    } catch (_) {}
    applyTheme(event.matches ? "dark" : "light");
  });

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="footer-grid">
          <div>
            <a class="brand" href="index.html" aria-label="Dropwell home">${logo}</a>
            <p class="unofficial">Dropwell is an original falling-block puzzle by Northwell Studio. It is not affiliated with Tetris Holding, The Tetris Company, or any Tetris product.</p>
          </div>
          <nav class="footer-nav" aria-label="Footer">
            <a href="products.html">Shop</a>
            <a href="news.html">News</a>
            <a href="community.html">Community</a>
            <a href="about.html">About</a>
          </nav>
          <nav class="legal-nav" aria-label="Legal">
            <a href="about.html">Terms of Use</a>
            <a href="about.html">Privacy Policy</a>
          </nav>
          <a class="btn btn-play" href="play.html">Play</a>
        </div>
        <div class="footer-bottom">
          <p>© ${new Date().getFullYear()} Northwell Studio</p>
          <div class="socials">
            <a href="community.html" aria-label="Community">${socialSvg.instagram}</a>
            <a href="news.html" aria-label="News">${socialSvg.x}</a>
            <a href="about.html" aria-label="About">${socialSvg.facebook}</a>
            <a href="play.html" aria-label="Play">${socialSvg.youtube}</a>
          </div>
        </div>
      </footer>
    `;
  }

  document.querySelectorAll("[data-newsletter]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const ok = form.parentElement.querySelector(".form-ok");
      form.hidden = true;
      if (ok) ok.classList.add("is-on");
    });
  });

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".reveal");
  if (reduced) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  document.querySelectorAll("[data-filters]").forEach((bar) => {
    const buttons = bar.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll("[data-cat]");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("is-on"));
        btn.classList.add("is-on");
        const cat = btn.dataset.filter;
        cards.forEach((card) => {
          card.style.display = !cat || cat === "all" || card.dataset.cat === cat ? "" : "none";
        });
      });
    });
  });

  document.querySelectorAll("[data-tabs]").forEach((root) => {
    const tabs = root.querySelectorAll("[data-tab]");
    const panels = document.querySelectorAll("[data-panel]");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("is-on"));
        panels.forEach((p) => p.classList.toggle("is-on", p.dataset.panel === tab.dataset.tab));
        tab.classList.add("is-on");
      });
    });
  });
})();
