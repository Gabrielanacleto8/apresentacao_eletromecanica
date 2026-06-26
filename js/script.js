const sections = [...document.querySelectorAll(".section")];
const total = sections.length;
let cur = 0;

const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const counter = document.getElementById("counter");
const progress = document.getElementById("progress");
const dotsEl = document.getElementById("dots");
const topNavLinks = [...document.querySelectorAll(".top-nav a")];
const navToggle = document.getElementById("navToggle");
const topNav = document.querySelector(".top-nav");
const revealItems = [...document.querySelectorAll(".reveal")];

sections.forEach((section, index) => {
  const dot = document.createElement("button");
  dot.className = `dot${index === 0 ? " active" : ""}`;
  dot.type = "button";
  dot.setAttribute("aria-label", `Ir para ${section.dataset.nav || `seção ${index + 1}`}`);
  dot.addEventListener("click", () => goTo(index));
  dotsEl.appendChild(dot);
});

const dots = [...dotsEl.children];

function goTo(index) {
  const nextIndex = Math.max(0, Math.min(index, total - 1));
  sections[nextIndex].scrollIntoView({ behavior: "smooth", block: "start" });
  setActive(nextIndex);
}

function setActive(index) {
  if (index === cur && sections[index].classList.contains("active")) return;

  sections[cur]?.classList.remove("active");
  dots[cur]?.classList.remove("active");

  cur = index;
  sections[cur].classList.add("active");
  dots[cur].classList.add("active");

  btnPrev.disabled = cur === 0;
  btnNext.disabled = cur === total - 1;
  counter.textContent = `${String(cur + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  topNavLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${sections[cur].id}`);
  });
}

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progressValue = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  progress.style.width = `${progressValue}%`;
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActive(sections.indexOf(entry.target));
      }
    });
  },
  {
    threshold: 0.45,
    rootMargin: "-10% 0px -40% 0px",
  }
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

sections.forEach((section) => sectionObserver.observe(section));
revealItems.forEach((item) => revealObserver.observe(item));

btnPrev.addEventListener("click", () => goTo(cur - 1));
btnNext.addEventListener("click", () => goTo(cur + 1));

document.addEventListener("keydown", (event) => {
  const tagName = document.activeElement?.tagName?.toLowerCase();
  if (tagName === "input" || tagName === "textarea") return;

  if (event.key === "ArrowRight" || event.key === "ArrowDown") goTo(cur + 1);
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") goTo(cur - 1);
});

topNavLinks.forEach((link) => {
  link.addEventListener("click", () => topNav.classList.remove("open"));
});

navToggle.addEventListener("click", () => {
  topNav.classList.toggle("open");
});

document.addEventListener("click", (event) => {
  const isMenuClick = topNav.contains(event.target) || navToggle.contains(event.target);
  if (!isMenuClick) topNav.classList.remove("open");
});

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);

setActive(0);
updateScrollProgress();

if (window.lucide) {
  lucide.createIcons();
}
