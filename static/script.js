const root = document.getElementById("root");

const elements = document.querySelectorAll(".images");

const video = document.getElementById("video");
video.style.display = "none";
let currentVideoNumber = 0;

elements[0].src = "images/" + images[0];
elements[1].src = "images/" + images[1];

elements[0].style.left = "0%";
sttm1 = setTimeout(() => {
  elements[0].style.transform = "scale(1.2)";
  clearTimeout(sttm1);
}, 100);

elements[1].style.left = "100%";

let currentImageIndex = 0;

setInterval(() => {
  const elements = document.querySelectorAll(".images");

  if (currentImageIndex % 3 === 1) {
    elements[1].style.scale = "1.2";

    elements[1].style.display = "block";
    video.style.display = "none";
    video.pause();
  }
  if (currentImageIndex % 3 === 2) {
    elements[0].style.left = "-100%";
    elements[1].style.left = "0%";

    elements[1].style.display = "block";
    video.style.display = "none";
    video.pause();
  } else {
    elements[1].style.display = "none";

    video.src = `videos/${currentVideoNumber}.mp4`;
    currentVideoNumber = (currentVideoNumber + 1) % 5;

    video.style.display = "block";
    video.play();

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
    currentImageIndex = (currentImageIndex + 1) % images.length;

    if (currentImageIndex % 3 === 0) {
      elements[1].style.transform = "scale(1.2)";
    }
    if (currentImageIndex % 3 === 2) {
      elements[1].style.transform = "translateX(-110px)";

      elements[1].style.display = "block";
      video.style.display = "none";
      video.pause();
    }

    root.removeChild(elements[0]);
    const newImage = document.createElement("img");
    newImage.className = "images";
    newImage.src = "images/" + images[(currentImageIndex + 1) % images.length];
    newImage.style.left = "100%";

    root.appendChild(newImage);

    clearTimeout(sttm3);
  }, 1100);
}, 5000);

// const image = temp1

// // Set up a transitionend event listener
// image.addEventListener('transitionend', () => {
//   // The first transition has ended, now trigger the second one
//   image.style.transition = 'transform 2s';
//   image.style.transform = 'scale(0.5)';
// });

// // Start the first transition
// image.style.transition = 'left 2s';
// image.style.left = '200px';
