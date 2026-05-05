const siteSettings = window.siteSettings || {};
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("js");

if (window.lucide) window.lucide.createIcons({ strokeWidth: 1.8 });

function applySiteSettings() {
  const companyName = siteSettings.companyName || "SeacoastPath s.r.o.";
  const companyShortName = siteSettings.companyShortName || "SeacoastPath";
  const companyLegalSuffix = siteSettings.companyLegalSuffix || "s.r.o.";
  const email = siteSettings.email || "support@seacoastpath.com";
  const website = siteSettings.website || "seacoastpath.com";
  const address = siteSettings.companyAddress || "";
  const companyId = siteSettings.companyId || "";
  const footerCompanyParts = [companyName, address, companyId ? `ID: ${companyId}` : ""].filter(Boolean);

  document.querySelectorAll(".brand-text").forEach((element) => {
    element.innerHTML = `${companyShortName}${companyLegalSuffix ? ` <small>${companyLegalSuffix}</small>` : ""}`;
  });

  document.querySelectorAll("a[href^='mailto:']").forEach((link) => {
    link.href = `mailto:${email}`;
    if (link.textContent.includes("@")) link.textContent = email;
  });

  document.querySelectorAll("[data-config]").forEach((element) => {
    const key = element.dataset.config;
    const value = {
      companyName,
      companyShortName,
      companyAddress: address,
      companyId,
      email,
      website,
      footerDescription: siteSettings.footerDescription,
      footerBottomLine: siteSettings.footerBottomLine,
    }[key];
    if (!value) return;
    element.textContent = value;
    if (element instanceof HTMLAnchorElement) {
      if (key === "email") element.href = `mailto:${email}`;
      if (key === "website") element.href = website.startsWith("http") ? website : `https://${website}`;
    }
  });

  document.querySelectorAll(".menu-footerline div:first-child strong").forEach((el) => (el.textContent = email));
  document.querySelectorAll(".menu-footerline div:first-child span").forEach((el) => (el.textContent = companyName));
  document.querySelectorAll(".footer-brand p").forEach((el) => {
    if (siteSettings.footerDescription) el.textContent = siteSettings.footerDescription;
  });
  document.querySelectorAll(".footer-col").forEach((column) => {
    if (column.querySelector("h3")?.textContent.trim().toLowerCase() !== "contact") return;
    const emailLink = column.querySelector("a[href^='mailto:']");
    const websiteLine = column.querySelector("span");
    if (emailLink) {
      emailLink.href = `mailto:${email}`;
      emailLink.textContent = email;
    }
    if (websiteLine) websiteLine.textContent = website;
  });
  document.querySelectorAll(".footer-bottom span:first-child").forEach((el) => {
    el.textContent = `Copyright ${siteSettings.copyrightYear || "2026"} ${footerCompanyParts.join(" · ")}. All rights reserved.`;
  });
  document.querySelectorAll(".footer-bottom span:last-child").forEach((el) => {
    if (siteSettings.footerBottomLine) el.textContent = siteSettings.footerBottomLine;
  });
}

applySiteSettings();

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const menuOverlay = document.querySelector(".menu-overlay");
const menuClose = document.querySelector(".menu-close");
const serviceMenuToggle = document.querySelector(".service-menu-toggle");
const serviceMenuGroup = document.querySelector(".menu-service-group");
const activePath = window.location.pathname.split("/").pop() || "index.html";

const syncHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 20);
syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

function openMenu() {
  menuOverlay?.classList.add("is-open");
  document.body.classList.add("menu-open");
  menuToggle?.setAttribute("aria-expanded", "true");
  menuOverlay?.setAttribute("aria-hidden", "false");
}

function closeMenu() {
  menuOverlay?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuOverlay?.setAttribute("aria-hidden", "true");
}

menuToggle?.addEventListener("click", openMenu);
menuClose?.addEventListener("click", closeMenu);
document.querySelectorAll(".overlay-nav a").forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("keydown", (event) => event.key === "Escape" && closeMenu());

serviceMenuToggle?.addEventListener("click", () => {
  const expanded = serviceMenuToggle.getAttribute("aria-expanded") === "true";
  serviceMenuToggle.setAttribute("aria-expanded", String(!expanded));
  serviceMenuGroup?.classList.toggle("is-open", !expanded);
});

document.querySelectorAll(".overlay-nav a, .footer-col a").forEach((link) => {
  if (link.getAttribute("href") === activePath) link.setAttribute("aria-current", "page");
});

document.querySelectorAll(".desktop-nav a").forEach((link) => {
  if (link.getAttribute("href") === activePath) link.setAttribute("aria-current", "page");
});

const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
  { threshold: 0.14 }
);
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelectorAll(".faq-item").forEach((item) => {
  const summary = item.querySelector("summary");
  const content = item.querySelector(".faq-content");
  let animation;
  if (!summary || !content) return;
  summary.addEventListener("click", (event) => {
    if (prefersReduced) return;
    event.preventDefault();
    if (animation) animation.cancel();
    const opening = !item.open;
    if (opening) {
      item.open = true;
      item.style.height = `${summary.offsetHeight}px`;
      item.style.overflow = "hidden";
      animation = item.animate({ height: [`${summary.offsetHeight}px`, `${item.scrollHeight}px`] }, { duration: 340, easing: "cubic-bezier(.22,1,.36,1)" });
      animation.onfinish = () => {
        item.style.height = "";
        item.style.overflow = "";
      };
    } else {
      item.style.height = `${item.offsetHeight}px`;
      item.style.overflow = "hidden";
      animation = item.animate({ height: [`${item.offsetHeight}px`, `${summary.offsetHeight}px`] }, { duration: 280, easing: "cubic-bezier(.22,1,.36,1)" });
      animation.onfinish = () => {
        item.open = false;
        item.style.height = "";
        item.style.overflow = "";
      };
    }
  });
});

document.querySelectorAll(".contact-form").forEach((form) => {
  const note = form.querySelector(".form-note");
  const params = new URLSearchParams(window.location.search);
  const status = params.get("form");
  if (note && status) {
    note.textContent =
      status === "sent"
        ? "Thank you. Your inquiry was sent to SeacoastPath s.r.o."
        : "The form could not be sent. Please check the fields or email us directly.";
  }
});

function initCookieBanner() {
  const key = "seacoastpath_cookie_consent";
  if (localStorage.getItem(key)) return;
  const banner = document.createElement("section");
  banner.className = "cookie-banner";
  banner.setAttribute("aria-label", "Cookie consent");
  banner.innerHTML = `<div><strong>Cookie preferences</strong><p>We use essential cookies and, with consent, analytics cookies to improve the website experience.</p><a href="cookie-policy.html">Read Cookie Policy</a></div><div class="cookie-actions"><button type="button" data-cookie="reject">Reject</button><button type="button" data-cookie="accept">Accept all</button></div>`;
  banner.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cookie]");
    if (!button) return;
    localStorage.setItem(key, JSON.stringify({ analytics: button.dataset.cookie === "accept", essential: true, savedAt: new Date().toISOString() }));
    banner.remove();
  });
  document.body.appendChild(banner);
}

initCookieBanner();
