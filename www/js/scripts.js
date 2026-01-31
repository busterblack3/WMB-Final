// Hamburger menu functionality
document.getElementById('hamburgerMenu').addEventListener('click', function() {
    var dropdown = document.getElementById('dropdownMenu');
    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "block";
    }
});

// Get the modal and close button elements
var passwordModal = document.getElementById("passwordModal");
var imageModal = document.getElementById("imageModal");

// PASSWORD MODAL
function openModal() {
    passwordModal.style.display = "block";
}

function checkPassword() {
    var password = document.getElementById("passwordInput").value;
    if (password == "cheesegrits") {
        window.location.href = "manual.html";
        passwordModal.style.display = "none";
    } else {
        alert("Incorrect password. Please try again.");
    }
}

document.getElementById('passwordInput').addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
        checkPassword();
    }
});

// Get the close button element for the passwordModal
var closeBtn = document.querySelector("#passwordModal .close");

// Add an event listener to the close button
closeBtn.addEventListener("click", function() {
    passwordModal.style.display = "none";
});

// GALLERY IMAGE EXPAND MODAL
var galleryImages = document.querySelectorAll('.gallery-img'); // Get all gallery images
var currentImageIndex = -1; // To keep track of which image is currently displayed

function openImageModal(imageElement) {
    imageModal.style.display = "block";
    var modalImg = document.getElementById('modalImage');
    modalImg.src = imageElement.src;
    currentImageIndex = Array.from(galleryImages).indexOf(imageElement); // Update the current image index
}

function closeImageModal() {
    imageModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == imageModal) {
        closeImageModal();
    }
    // Adjusted condition to close passwordModal
    if (event.target == passwordModal) {
        passwordModal.style.display = "none";
    }
}

// New code for arrow key navigation
document.addEventListener('keydown', function(event) {
    if (imageModal.style.display === "block") { // Only work if the image modal is displayed
        if (event.key === 'ArrowLeft') {
            // Show the previous image
            if (currentImageIndex > 0) {
                currentImageIndex--;
                var modalImg = document.getElementById('modalImage');
                modalImg.src = galleryImages[currentImageIndex].src;
            }
        } else if (event.key === 'ArrowRight') {
            // Show the next image
            if (currentImageIndex < galleryImages.length - 1) {
                currentImageIndex++;
                var modalImg = document.getElementById('modalImage');
                modalImg.src = galleryImages[currentImageIndex].src;
            }
        }
    }
});


// HOVER ON PROPERTY PAGE - WORK IN PROGRESS

// Updates coordinates of image maps based on resize
//let originalWidth = 0;
//let originalHeight = 0;

//function updateMapCoordinates() {
//  const imgElement = document.querySelector(".large-image");
  
  // If the image is not loaded yet, exit the function
//  if (!imgElement.naturalWidth) return;

  // Initialize original dimensions if they're zero
//  if (originalWidth === 0) originalWidth = imgElement.naturalWidth;
//  if (originalHeight === 0) originalHeight = imgElement.naturalHeight;

//  const currentWidth = imgElement.offsetWidth;
//  const currentHeight = imgElement.offsetHeight;

//  const widthRatio = currentWidth / originalWidth;
//  const heightRatio = currentHeight / originalHeight;

//  const areas = document.querySelectorAll(".area");

//  areas.forEach((area) => {
//    const originalCoords = area.getAttribute("data-original-coords");
//    const coordsArray = originalCoords.split(",");

//    const recalculatedCoords = coordsArray.map((coord, index) => {
//      return index % 2 === 0 ? coord * widthRatio : coord * heightRatio;
//    });

//    area.coords = recalculatedCoords.join(",");
//  });
//}

// Call updateMapCoordinates initially and whenever the window resizes
//updateMapCoordinates();
//window.addEventListener("resize", updateMapCoordinates);

// Hovering images on property page
//document.addEventListener('DOMContentLoaded', () => {
//  const areas = document.querySelectorAll('.area');

//  areas.forEach(area => {
//    area.addEventListener('mouseover', function(event) {
//      const imageSrc = this.getAttribute('data-image');
//      const popupImageContainer = document.getElementById('popup-image-container');
//      const popupImage = document.getElementById('popup-image');

//      popupImage.src = imageSrc;
//      popupImageContainer.style.display = 'block';
//      popupImageContainer.style.left = event.pageX + 'px';
//      popupImageContainer.style.top = event.pageY + 'px';
//    });

//    area.addEventListener('mouseout', () => {
//      const popupImageContainer = document.getElementById('popup-image-container');
//      popupImageContainer.style.display = 'none';
//    });
//  });
//});

//document.addEventListener('DOMContentLoaded', function() {
//  const imgElement = document.querySelector(".large-image");
//  imgElement.addEventListener('load', function() {
//    originalWidth = this.naturalWidth;
//    originalHeight = this.naturalHeight;
//    updateMapCoordinates();
//  });
//});

