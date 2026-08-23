const progressBar = document.querySelector(".reading-progress span");
const navLinks = [...document.querySelectorAll(".section-nav a")];
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function updateReadingProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
  progressBar.style.width = `${progress * 100}%`;
}

window.addEventListener("scroll", updateReadingProgress, { passive: true });
updateReadingProgress();

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-20% 0px -62%", threshold: [0, 0.2, 0.5] },
  );

  observedSections.forEach((section) => sectionObserver.observe(section));
}

const dialog = document.querySelector("#image-dialog");
const dialogImage = dialog?.querySelector("img");
const dialogClose = dialog?.querySelector(".dialog-close");

document.querySelectorAll("[data-full-image]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!dialog || !dialogImage) return;
    const sourceImage = button.querySelector("img");
    dialogImage.src = button.dataset.fullImage;
    dialogImage.alt = sourceImage?.alt || "Expanded research figure";
    document.body.classList.add("dialog-open");
    dialog.showModal();
  });
});

function closeDialog() {
  if (!dialog?.open) return;
  dialog.close();
  document.body.classList.remove("dialog-open");
  if (dialogImage) dialogImage.src = "";
}

dialogClose?.addEventListener("click", closeDialog);
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});
dialog?.addEventListener("close", () => document.body.classList.remove("dialog-open"));

const copyButton = document.querySelector("#copy-citation");
const citation = document.querySelector("#bibtex");

copyButton?.addEventListener("click", async () => {
  const originalLabel = copyButton.textContent;
  try {
    await navigator.clipboard.writeText(citation?.textContent.trim() || "");
    copyButton.textContent = "Copied";
  } catch {
    copyButton.textContent = "Select & copy";
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(citation);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  window.setTimeout(() => {
    copyButton.textContent = originalLabel;
  }, 1800);
});

const year = document.querySelector("#current-year");
if (year) year.textContent = new Date().getFullYear();
