// ================================
// DYNAMIC MENU LOAD & TOGGLE
// ================================
fetch("menu.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("menu-placeholder").innerHTML = data;

    // Add hamburger menu click functionality
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const dropdown = document.getElementById('dropdownMenu');

    if (hamburgerMenu && dropdown) {
      hamburgerMenu.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent click from bubbling to document
        dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
      });

      // Handle menu link clicks with custom scroll to avoid lazy-load layout shift issues
      const menuLinks = dropdown.querySelectorAll('a');
      menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();

          const targetId = this.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);

          // Close menu immediately
          dropdown.style.display = "none";

          if (targetElement) {
            // Use scrollIntoView for accurate positioning even with lazy-loaded images
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });

      // Close menu when clicking anywhere outside
      document.addEventListener('click', function(e) {
        if (dropdown.style.display === "block" && !dropdown.contains(e.target)) {
          dropdown.style.display = "none";
        }
      });
    }
  });


// ================================
// PASSWORD MODAL FUNCTIONALITY
// (Now used for manual downloads)
// ================================
let pendingManualHref = null;

const passwordModal = document.getElementById("passwordModal");
const passwordInput = document.getElementById("passwordInput");

function openModal(href = null) {
  pendingManualHref = href; // store which PDF they requested
  if (!passwordModal) return;
  passwordModal.style.display = "block";
  if (passwordInput) {
    passwordInput.value = "";
    passwordInput.focus();
  }
}

function checkPassword() {
  if (!passwordInput) return;

  const password = passwordInput.value;
  if (password === "cheesegrits") {
    // If they clicked a manual cover, open that PDF
    if (pendingManualHref) {
      window.open(pendingManualHref, "_blank");
    } else {
      // Fallback behavior (if you ever call openModal() without a href)
      window.location.href = "manual.html";
    }

    pendingManualHref = null;
    if (passwordModal) passwordModal.style.display = "none";
  } else {
    alert("Incorrect password. Please try again.");
  }
}

// Trigger modal when clicking a manual cover/link
document.addEventListener("click", function (e) {
  const manualLink = e.target.closest(".manual-download");
  if (!manualLink) return;

  e.preventDefault();
  const href = manualLink.getAttribute("data-manual-href") || manualLink.getAttribute("href");
  openModal(href);
});

// Enter-to-submit
if (passwordInput) {
  passwordInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") checkPassword();
  });
}

// Close button
const closeBtn = document.querySelector("#passwordModal .close");
if (closeBtn) {
  closeBtn.addEventListener("click", function () {
    if (passwordModal) passwordModal.style.display = "none";
    pendingManualHref = null;
  });
}

// ================================
// GALLERY IMAGE MODAL
// ================================
var imageModal = document.getElementById("imageModal");
var galleryImages = document.querySelectorAll('.gallery-img'); // Will be re-queried after DOM ready
var currentImageIndex = -1;

function openImageModal(imageElement) {
  if (!imageModal) return;
  imageModal.style.display = "block";
  var modalImg = document.getElementById('modalImage');
  if (!modalImg) return;
  modalImg.src = imageElement.src;
  currentImageIndex = Array.from(galleryImages).indexOf(imageElement);
}

function closeImageModal() {
  if (!imageModal) return;
  imageModal.style.display = "none";
}

window.onclick = function(event) {
  if (imageModal && event.target == imageModal) closeImageModal();
  if (passwordModal && event.target == passwordModal) passwordModal.style.display = "none";
};

document.addEventListener('keydown', function(event) {
  if (!imageModal) return;
  if (imageModal.style.display === "block") {
    const modalImg = document.getElementById('modalImage');
    if (!modalImg) return;
    if (event.key === 'ArrowLeft' && currentImageIndex > 0) {
      currentImageIndex--;
      modalImg.src = galleryImages[currentImageIndex].src;
    } else if (event.key === 'ArrowRight' && currentImageIndex < galleryImages.length - 1) {
      currentImageIndex++;
      modalImg.src = galleryImages[currentImageIndex].src;
    }
  }
});

// ================================
// Other Stuff
// ================================

// Reveal-on-scroll
document.addEventListener("DOMContentLoaded", () => {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.12 });

  els.forEach(el => obs.observe(el));
});

// ================================
// STICKY HEADER BAR (show after hero)
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.getElementById("stickyHeaderTrigger");
  if (!trigger) return;

  const triggerTop = trigger.offsetTop;

  const updateStickyHeader = () => {
    document.body.classList.toggle("has-sticky-header", window.scrollY >= triggerTop);
  };

  updateStickyHeader();
  window.addEventListener("scroll", updateStickyHeader, { passive: true });
  window.addEventListener("resize", () => {
    // Recompute on resize because hero height can change
    updateStickyHeader();
  });
});

// ================================
// PHOTO GALLERY - LOAD MORE / SHOW LESS
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("photoGallery");
  const loadMoreBtn = document.getElementById("loadMorePhotos");
  const showLessBtn = document.getElementById("showLessPhotos");

  // Re-query gallery images for modal navigation
  galleryImages = document.querySelectorAll('.gallery-img');

  if (!gallery || !loadMoreBtn || !showLessBtn) return;

  // Start with gallery collapsed (showing only first 20 images)
  gallery.classList.add("collapsed");

  loadMoreBtn.addEventListener("click", () => {
    // Expand the gallery
    gallery.classList.remove("collapsed");
    // Swap buttons
    loadMoreBtn.classList.add("hidden");
    showLessBtn.classList.remove("hidden");
  });

  showLessBtn.addEventListener("click", () => {
    // Collapse the gallery
    gallery.classList.add("collapsed");
    // Swap buttons
    showLessBtn.classList.add("hidden");
    loadMoreBtn.classList.remove("hidden");
    // Scroll back to the photos section
    document.getElementById("photos").scrollIntoView({ behavior: "smooth" });
  });
});