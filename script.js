document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector("header");
    const nav = header.querySelector("nav ul");

    const hamburgerButton = document.createElement("button");
    hamburgerButton.id = "menu-toggle";
    hamburgerButton.innerHTML = "&#9776;";

    hamburgerButton.style.background = "none";
    hamburgerButton.style.border = "none";
    hamburgerButton.style.color = "white";
    hamburgerButton.style.fontSize = "24px";
    hamburgerButton.style.cursor = "pointer";
    hamburgerButton.style.margin = "0 auto 10px auto";

    header.insertBefore(hamburgerButton, header.querySelector("nav"));

    function updateMenuVisibility() {
        if (window.innerWidth < 600) {
            nav.style.display = "none";
            hamburgerButton.style.display = "block";
        } else {
            nav.style.display = "flex";
            hamburgerButton.style.display = "none";
        }
    }

    hamburgerButton.addEventListener("click", () => {
        if (nav.style.display === "none" || nav.style.display === "") {
            nav.style.display = "flex";
            nav.style.flexDirection = "column";
            nav.style.alignItems = "center";
        } else {
            nav.style.display = "none";
        }
    });

    window.addEventListener("resize", updateMenuVisibility);
    updateMenuVisibility();

    if (window.location.pathname.endsWith("photos.html")) {
        const galleryImages = [
            "photos/boulder.webp",
            "photos/ml.webp",
            "photos/mountains.webp",
            "photos/windsurf.webp"
        ];

        const galleryContainer = document.querySelector(".gallery");

        function loadImage(src) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.style.maxWidth = "200px";
                img.style.height = "auto";
                img.onload = () => resolve(img);
                img.onerror = () => reject(`Failed to load image: ${src}`);
            });
        }

        Promise.all(galleryImages.map(loadImage))
            .then(images => {
                images.forEach(img => galleryContainer.appendChild(img));
            })
            .catch(error => console.error(error));
    }
});
