const root = document.getElementById("root");

const elements = document.querySelectorAll(".images");

elements[0].style.left = "0%";
sttm1 = setTimeout(() => {
  elements[0].style.transform = "scale(1.2)";
  clearTimeout(sttm1);
}, 100);

elements[1].style.left = "100%";

const numberOfImages = 7;

currentImage = 0;

setInterval(() => {
  const elements = document.querySelectorAll(".images");

  if (currentImage % 3 === 2) {
    elements[0].style.left = "-100%";
    elements[1].style.left = "0%";
  } else {
    elements[0].className = "images-no-transition";
    elements[1].className = "images-no-transition";
    elements[0].style.left = "-100%";
    elements[1].style.left = "0%";
    sttm2 = setTimeout(() => {
      elements[0].className = "images";
      elements[1].className = "images";
      clearTimeout(sttm2);
    }, 90);
  }

  sttm3 = setTimeout(() => {
    currentImage = (currentImage + 1) % numberOfImages;
    if (currentImage % 3 === 0) {
      elements[1].style.transform = "scale(1.2)";
    }
    if (currentImage % 3 === 2) {
      elements[1].style.scale = "1.2";
      elements[1].style.transform = "translateX(110px)";
    }

    root.removeChild(elements[0]);
    const newImage = document.createElement("img");
    newImage.className = "images";
    newImage.src = `images/0${(currentImage + 1) % numberOfImages}.webp`;
    newImage.style.left = "100%";

    root.appendChild(newImage);

    clearTimeout(sttm3);
  }, 1100);
}, 5000);
