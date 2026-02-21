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
// MAP MODAL (Leaflet)
// ================================

// Config — for public_html/html/main.html; change to 'images/map/' for local prototype
const MAP_IMG_BASE = '../images/map/';
const MAP_IMG_W = 807;
const MAP_IMG_H = 894;

// Location data
const mapLocations = [
  {
    id: 1,
    name: "Main House & Pool",
    desc: "Four bedrooms (five individual beds), two bathrooms, and a pool. The primary residence of Woods Mill Bend and the flagship short-term rental.",
    coords: [374, 432],
    drawing: "../images/property/mainhouse.png",
    folder: "1-main-house",
    images: ["image053.png", "image10.png", "image16.png", "image17.png", "image18.png"]
  },
  {
    id: 2,
    name: "Log Cabin",
    desc: "One bedroom, one bathroom — a cozy standalone cabin nestled in the trees, available for short-term rentals on Airbnb.",
    coords: [557, 407],
    drawing: "../images/property/logcabin.png",
    folder: "2-log-cabin",
    images: ["IMG_4083.png", "image088.png"]
  },
  {
    id: 3,
    name: "Sauna Haus",
    desc: "Recently renovated with an electric sauna room and two large tubs on the back porch for cold plunge. Shared amenity for all guests.",
    coords: [422, 498],
    drawing: "../images/property/artstudio.png",
    folder: "3-sauna-haus",
    images: ["image086.png", "image090.png"]
  },
  {
    id: 4,
    name: "Farm House",
    desc: "Currently being renovated. Four bedrooms, one bathroom — used as a workspace and gathering space for friends and family.",
    coords: [440, 574],
    drawing: "../images/property/farmhouse.png",
    folder: "4-farm-house",
    images: ["image055.png", "image4.png"]
  },
  {
    id: 5,
    name: "Dance Hall",
    desc: "A large, open, stand-alone room overlooking the Rocky River. Perfect for yoga (mats & blocks provided), ping pong, movie nights (projector on site), or gathering.",
    coords: [402, 604],
    drawing: "../images/property/dancehall.png",
    folder: "5-dance-hall",
    images: ["image047.png", "image084.png"]
  },
  {
    id: 6,
    name: "Old Mill",
    desc: "A historic mill structure — a remnant of the land's storied past, offering a glimpse into the history of Woods Mill Bend.",
    coords: [413, 689],
    drawing: null,
    folder: "6-old-mill",
    images: []
  },
  {
    id: 7,
    name: "Secret Garden",
    desc: "A hidden garden retreat tucked into the landscape — a quiet spot for reading, reflection, or simply listening to the river.",
    coords: [330, 586],
    drawing: null,
    folder: "7-secret-garden",
    images: ["image036.png", "image043.png"]
  },
  {
    id: 8,
    name: "River Access #1",
    desc: "Primary access point to the Rocky River. Perfect for swimming, kayaking, fishing, or watching the water move.",
    coords: [339, 771],
    drawing: null,
    folder: "8-river-access-1",
    images: ["image005.png", "image012.png"]
  },
  {
    id: 9,
    name: "River Access #2",
    desc: "A second river access point offering a different angle along the Rocky River banks — great for a quiet morning walk.",
    coords: [214, 243],
    drawing: null,
    folder: "9-river-access-2",
    images: ["image003.png", "image035.png"]
  },
  {
    id: 10,
    name: "Bridge",
    desc: "The wooden bridge connecting areas of the property, with views of the river and surrounding landscape in both directions.",
    coords: [328, 447],
    drawing: null,
    folder: "10-bridge",
    images: []
  }
];

// State
let wmbMap = null;
let activeMarkerEl = null;
let hintDismissed = false;

// Init Leaflet map
function initMap() {
  if (wmbMap) { wmbMap.invalidateSize(); return; }

  const bounds = [[0, 0], [MAP_IMG_H, MAP_IMG_W]];

  wmbMap = L.map('leafletMap', {
    crs: L.CRS.Simple,
    minZoom: -1, maxZoom: 2.5,
    zoomSnap: 0.25, zoomDelta: 0.5,
    attributionControl: false,
    zoomControl: true
  });
  wmbMap.zoomControl.setPosition('bottomright');

  L.imageOverlay('../images/map-color2.jpg', bounds).addTo(wmbMap);
  wmbMap.fitBounds(bounds);
  wmbMap.setMaxBounds([[-MAP_IMG_H * 0.15, -MAP_IMG_W * 0.15], [MAP_IMG_H * 1.15, MAP_IMG_W * 1.15]]);

  mapLocations.forEach(loc => {
    const icon = L.divIcon({
      className: '',
      html: `<div class="map-marker" title="${loc.name}">${loc.id}</div>`,
      iconSize: [28, 28], iconAnchor: [14, 14]
    });
    L.marker(loc.coords, { icon }).addTo(wmbMap).on('click', function () {
      showInfoPanel(loc, this);
    });
  });

  wmbMap.on('click', function (e) {
    if (!e.originalEvent.target.closest('.map-marker')) closeInfoPanel();
  });
}

// Info panel
function showInfoPanel(loc, marker) {
  if (activeMarkerEl) activeMarkerEl.classList.remove('active');
  const el = marker.getElement()?.querySelector('.map-marker');
  if (el) { el.classList.add('active'); activeMarkerEl = el; }

  document.getElementById('mapInfoNumber').textContent = loc.id;
  document.getElementById('mapInfoTitle').textContent = loc.name;

  const drawEl = document.getElementById('mapInfoDrawing');
  if (loc.drawing) {
    drawEl.src = loc.drawing;
    drawEl.alt = loc.name;
    drawEl.style.display = 'block';
  } else {
    drawEl.style.display = 'none';
    drawEl.src = '';
  }

  document.getElementById('mapInfoDesc').textContent = loc.desc;

  const gridEl = document.getElementById('mapPhotoGrid');
  const dividerEl = document.getElementById('mapPhotoDivider');
  gridEl.innerHTML = '';
  gridEl.className = 'map-photo-grid';

  if (loc.images && loc.images.length > 0) {
    dividerEl.style.display = 'block';
    if (loc.images.length === 1) gridEl.classList.add('single');
    loc.images.forEach((filename, idx) => {
      const img = document.createElement('img');
      img.src = MAP_IMG_BASE + loc.folder + '/' + filename;
      img.alt = loc.name + ' ' + (idx + 1);
      img.loading = 'lazy';
      img.onclick = () => openLightbox(loc, idx);
      gridEl.appendChild(img);
    });
    document.getElementById('mapNoPhotos').style.display = 'none';
  } else {
    dividerEl.style.display = 'none';
    document.getElementById('mapNoPhotos').style.display = 'none';
  }

  document.getElementById('mapInfoPanel').classList.add('active');

  if (!hintDismissed) {
    hintDismissed = true;
    document.getElementById('mapTapHint').classList.add('hidden');
  }
}

function closeInfoPanel() {
  document.getElementById('mapInfoPanel').classList.remove('active');
  if (activeMarkerEl) { activeMarkerEl.classList.remove('active'); activeMarkerEl = null; }
}

// Lightbox
let lbLoc = null;
let lbIdx = 0;

function openLightbox(loc, idx) {
  lbLoc = loc; lbIdx = idx;
  renderLightbox();
  document.getElementById('photoLightbox').classList.add('open');
}

function renderLightbox() {
  document.getElementById('photoLbImg').src = MAP_IMG_BASE + lbLoc.folder + '/' + lbLoc.images[lbIdx];
  document.getElementById('photoLbCounter').textContent = (lbIdx + 1) + ' / ' + lbLoc.images.length;
  const show = lbLoc.images.length > 1;
  document.querySelector('.photo-lb-prev').style.display = show ? '' : 'none';
  document.querySelector('.photo-lb-next').style.display = show ? '' : 'none';
}

function lbStep(dir) {
  lbIdx = (lbIdx + dir + lbLoc.images.length) % lbLoc.images.length;
  renderLightbox();
}

function closeLightbox() {
  document.getElementById('photoLightbox').classList.remove('open');
  document.getElementById('photoLbImg').src = '';
}

// Modal open/close
function openMapModal() {
  document.getElementById('mapModal').style.display = 'flex';
  setTimeout(() => { initMap(); if (wmbMap) wmbMap.invalidateSize(); }, 80);
}

function closeMapModal() {
  document.getElementById('mapModal').style.display = 'none';
  closeInfoPanel();
}

// Keyboard handlers
document.addEventListener('keydown', function (e) {
  if (document.getElementById('photoLightbox') && document.getElementById('photoLightbox').classList.contains('open')) {
    if (e.key === 'ArrowRight') lbStep(1);
    else if (e.key === 'ArrowLeft') lbStep(-1);
    else if (e.key === 'Escape') closeLightbox();
  } else if (e.key === 'Escape' && document.getElementById('mapModal') && document.getElementById('mapModal').style.display === 'flex') {
    closeMapModal();
  }
});

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