(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const year = document.querySelectorAll("[data-year]");
  year.forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  const clocks = document.querySelectorAll("[data-clock]");
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const tickClock = () => {
    const t = fmt.format(new Date());
    clocks.forEach((el) => {
      el.textContent = t;
    });
  };
  tickClock();
  window.setInterval(tickClock, 15000);

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const mobile = document.querySelector(".nav-mobile");

  if (toggle && mobile && header) {
    const setOpen = (open) => {
      header.classList.toggle("is-open", open);
      mobile.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    };

    toggle.addEventListener("click", () => {
      setOpen(!header.classList.contains("is-open"));
    });

    mobile.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  if (header) {
    let lastY = window.scrollY;
    window.addEventListener(
      "scroll",
      () => {
        if (header.classList.contains("is-open")) return;
        const y = window.scrollY;
        const hide = y > lastY && y > 80;
        header.classList.toggle("is-hidden", hide);
        lastY = y;
      },
      { passive: true }
    );
  }

  if (fine && !reduced) {
    document.body.classList.add("has-cursor");
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;

    window.addEventListener(
      "mousemove",
      (event) => {
        x = event.clientX;
        y = event.clientY;
        if (dot) dot.style.transform = `translate(${x}px, ${y}px)`;
      },
      { passive: true }
    );

    const follow = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (ring) ring.style.transform = `translate(${rx}px, ${ry}px)`;
      window.requestAnimationFrame(follow);
    };
    follow();

    document.querySelectorAll("a, button, .alphabet li").forEach((el) => {
      el.addEventListener("mouseenter", () => document.body.classList.add("cursor-grow"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-grow"));
    });
  }

  const river = document.querySelector(".river path");
  if (river && !reduced) {
    const draw = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      river.style.strokeDashoffset = String(1 - p);
    };
    draw();
    window.addEventListener("scroll", draw, { passive: true });
  }

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
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  const bleedImg = document.querySelector(".bleed img");
  if (bleedImg && !reduced) {
    window.addEventListener(
      "scroll",
      () => {
        const rect = bleedImg.parentElement.getBoundingClientRect();
        const offset = rect.top * -0.12;
        bleedImg.style.transform = `scale(1.08) translateY(${offset}px)`;
      },
      { passive: true }
    );
  }
})();
