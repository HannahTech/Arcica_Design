const imageCount = 12;
const allImages = [
  "00.jpg",
  "001.jpg",
  "004.jpg",
  "008.jpg",
  "008A.jpg",
  "009.jpg",
  "01.jpg",
  "010.jpg",
  "011.jpg",
  "02.jpg",
  "022.jpg",
  "03.jpg",
  "04.jpg",
  "05.jpg",
  "06.jpg",
  "07.jpg",
  "08.jpg",
  "084-ArcicaVynerRd.jpg",
  "09.jpg",
  "097-ArcicaVynerRd.jpg",
  "10.jpg",
  "11.jpg",
  "11mistycres-001-A1.jpg",
  "11mistycres-004-A1.jpg",
  "12.jpg",
  "143-ArcicaVynerRd.jpg",
  "165-ArcicaVynerRd.jpg",
  "2.jpg",
  "23.jpg",
  "23MIST-6323S2.jpg",
  "23MIST-6481S2.jpg",
  "23MIST-6495S2.jpg",
  "23MIST-6557S2.jpg",
  "23MIST-6582S2.jpg",
  "23MIST-7622S2.jpg",
  "292-ArcicaVynerRd-A1.jpg",
  "3.jpg",
  "313-ArcicaVynerRd-A1.jpg",
  "DSC_0253.jpg",
  "DSC_0284_1.jpg",
  "DSC_0319.jpg",
  "DSC_0322.jpg",
  "DSC_1762-A1.jpg",
  "DSC_3914.jpg",
  "DSC_4386.jpg",
  "DSC_9303.jpg",
  "DSC_9344.jpg",
  "DSC_9584.jpg",
  "TED-9138S2.jpg",
  "TED-9823S2.jpg",
  "TED-9835S2.jpg",
  "TED-9855S2a.jpg",
  "TED179-8222-2S2-Copy.jpg",
  "TED179-8264S2.jpg",
  "TED179-8289S2.jpg",
  "TED179-8317S2.jpg",
];

const images = allImages
  .sort((a, b) => 0.5 - Math.random())
  .slice(0, imageCount);

// const imagesFolder = "./images/";

// fetch(imagesFolder)
//   .then((response) => response.text())
//   .then((data) => {
//     const parser = new DOMParser();
//     const htmlDoc = parser.parseFromString(data, "text/html");
//     const images = [];
//     const imageLinks = Array.from(htmlDoc.getElementsByTagName("a"));
//     const imageFiles = imageLinks
//       .map((link) => link.getAttribute("href"))
//       .filter((filename) => filename.match(/\.(jpe?g|png)$/i));

//     while (images.length < imageCount) {
//       const randomIndex = Math.floor(Math.random() * imageFiles.length);
//       const randomImage = imageFiles[randomIndex];
//       imageFiles.splice(randomIndex, 1);

//       const imageName = randomImage.replace("/images/", "");

//       images.push(imageName);
//     }
//     console.log(images);
let slideIndex = 0;

const videos = ["8.mp4", "7.mp4", "5.mp4", "2.mp4"];

const slideshowContainer = document.querySelector(".slideshow-container");
let j = 0;

for (let i = 0; i < Math.max(images.length, videos.length); i++) {
  const slide = document.createElement("div");
  slide.classList.add("slideshow-slide");

  if (i % 3 == 0) {
    const img = document.createElement("img");
    img.src = `images/${images[i]}`;
    img.classList.add("overlay");
    slide.appendChild(img);
  } else if (i % 3 == 1) {
    const img = document.createElement("img");
    img.src = `images/${images[i]}`;
    img.classList.add("move_left");
    slide.appendChild(img);
  } else if (i % 3 == 2) {
    const video = document.createElement("video");
    video.src = `videos/${videos[j]}`;
    video.playbackRate = 0.6;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    slide.appendChild(video);
    j++;
  }
  slideshowContainer.appendChild(slide);
}
// console.log(slideshowContainer.childNodes.length);

const slides = document.getElementsByClassName("slideshow-slide");

function showSlides() {
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
    slides[i].querySelectorAll("img.overlay").forEach((img) => img.remove());
    slides[i].querySelectorAll("img.move_left").forEach((img) => img.remove());
    const videos = slides[i].querySelectorAll("video");
    for (let j = 0; j < videos.length; j++) {
      videos[j].pause();
      videos[j].currentTime = 0;
    }
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }

  const currentSlide = slides[slideIndex - 1];
  currentSlide.classList.add("active");

  if (slideIndex % 3 == 1) {
    const overlay = document.createElement("img");
    overlay.classList.add("overlay");
    overlay.src = `images/${images[slideIndex - 1]}`;
    currentSlide.appendChild(overlay);
    setTimeout(showSlides, 5000);
  } else if (slideIndex % 3 == 2) {
    const move_left = document.createElement("img");
    move_left.classList.add("move_left");
    move_left.src = `images/${images[slideIndex - 1]}`;
    currentSlide.appendChild(move_left);
    setTimeout(showSlides, 5000);
  } else if (slideIndex % 3 == 0) {
    const currentVideo = currentSlide.querySelectorAll("video")[0];
    currentVideo.style.display = "block";
    currentVideo.play();
    setTimeout(showSlides, 7000);
  }
}

showSlides();
// })
// .catch((error) => {
//   console.error("Error fetching image filenames:", error);
// });

const logo = document.querySelector(".logo");
const menu = document.querySelector(".menu");

logo.addEventListener("mouseenter", () => {
  menu.style.opacity = 0.75;
  menu.style.left = "0";
  setTimeout(() => {
    logo.style.color = "black";
  }, 50);
});

menu.addEventListener("mouseleave", () => {
  setTimeout(() => {
    menu.style.opacity = 0;
    menu.style.left = "-13%";
    logo.style.color = "white";
  }, 100);
});
