// fs.readdirSync("./images")
const imageCount = 12;
const allImages = [
  "001.jpg",
  "004.jpg",
  "008.jpg",
  "011.jpg",
  "043-Arcica Vyner Rd 1.jpg",
  "084-Arcica Vyner Rd.jpg",
  "1.jpg",
  "11mistycres-001-R.jpg",
  "11mistycres-012.jpg",
  "143-Arcica Vyner Rd.jpg",
  "192-Arcica Vyner Rd.jpg",
  "2.jpg",
  "23MIST-6323S2.jpg",
  "23MIST-6465S2.jpg",
  "23MIST-6481S2.jpg",
  "23MIST-6548S2.jpg",
  "23MIST-6582S2.jpg",
  "29-1.jpg",
  "29-2.jpg",
  "3.jpg",
  "313-Arcica Vyner Rd.jpg",
  "DSC_0253.jpg",
  "DSC_0284_1.jpg",
  "DSC_8665.jpg",
  "DSC_9578.jpg",
  "TED-9138S2.jpg",
  "TED-9276S2.jpg",
  "TED-9823S2.jpg",
  "TED-9835S2.jpg",
  "TED179-8264S2a.jpg",
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

const allVideos = [
  "01.mp4",
  "02.mp4",
  "03.mp4",
  "04.mp4",
  "05.mp4",
  // "06.mp4",
  "07.mp4",
  "08.mp4",
  "09.mp4",
];

const videos = allVideos
  .sort((a, b) => 0.5 - Math.random())
  .slice(0, imageCount);

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
    video.src = `videos/1080/${videos[j]}`;

    // console.log(videos[j]);
    // video.playbackRate = 0.9;
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
      videos[j].style.opacity = "0";
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
    overlay.style.opacity = "0";
    currentSlide.appendChild(overlay);
    fadeIn(overlay, 1500);
    // setTimeout(function () {
    //   fadeOut(currentSlide, 200, function () {
    //     showSlides();
    //   });
    // }, 5000);
    setTimeout(showSlides, 5000);
  } else if (slideIndex % 3 == 2) {
    const move_left = document.createElement("img");
    move_left.classList.add("move_left");
    move_left.src = `images/${images[slideIndex - 1]}`;
    move_left.style.opacity = "0";
    currentSlide.appendChild(move_left);
    fadeIn(move_left, 1500);
    setTimeout(showSlides, 5000);
  } else if (slideIndex % 3 == 0) {
    const currentVideo = currentSlide.querySelectorAll("video")[0];
    currentVideo.style.display = "block";
    currentVideo.play();
    fadeIn(currentVideo, 500);
    setTimeout(function () {
      fadeOut(currentVideo, 1500, function () {
        currentVideo.pause();
        currentVideo.style.display = "none";
        showSlides();
      });
    }, 5000);
  }
}

function fadeIn(element, duration) {
  let start = null;
  element.style.opacity = "0";

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    element.style.opacity = `${Math.min(progress / duration, 1)}`;
    if (progress < duration) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}
function fadeOut(element, duration, callback) {
  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    element.style.opacity = `${Math.max(1 - progress / duration, 0)}`;
    if (progress < duration) {
      window.requestAnimationFrame(step);
    } else {
      if (callback) callback();
    }
  }

  window.requestAnimationFrame(step);
}

showSlides();
// })
// .catch((error) => {
//   console.error("Error fetching image filenames:", error);
// });

// const logo = document.querySelector(".logo");
// const menu = document.querySelector(".menu");

// logo.addEventListener("mouseenter", () => {
//   menu.style.opacity = 0.75;
//   menu.style.left = "0";
//   setTimeout(() => {
//     logo.style.color = "black";
//   }, 50);
// });

// menu.addEventListener("mouseleave", () => {
//   setTimeout(() => {
//     menu.style.opacity = 0;
//     menu.style.left = "-13%";
//     logo.style.color = "white";
//   }, 100);
// });

// const logo = document.querySelector(".logo");
const menu = document.querySelector(".menu");
const social = document.querySelector(".social-icons");
let timeout;
let currentLine = null;
let currentContent = null;
let lineTimeout;
let hideTabsTime = 20000;
let hideTextTime = 30000;
let screenMobile = 768;

function showElements() {
  menu.classList.remove("hide");
  social.classList.remove("hide");
}

function hideElements() {
  if (window.innerWidth > screenMobile) {
    menu.classList.add("hide");
    social.classList.add("hide");
  }
}

function hideElementsAfterDelay(delay) {
  timeout = setTimeout(function () {
    hideElements();
  }, delay);
}

window.addEventListener("load", function () {
  hideElementsAfterDelay(hideTabsTime);
});

document.addEventListener("mousemove", function () {
  clearTimeout(timeout);
  showElements();
  hideElementsAfterDelay(hideTabsTime);
});

document.addEventListener("click", function (event) {
  const isMenuClick = event.target.classList.contains("menu-item");
  const isContentTextClick = event.target.classList.contains("content-text");

  if (!isMenuClick && !isContentTextClick) {
    removeCurrentLineAndContent();
  }
});

// document.addEventListener("mouseout", function () {
//   clearTimeout(timeout);
//   timeout = setTimeout(function () {
//     hideElements();
//   }, 3000);
// });

// Menu Content
document.addEventListener("DOMContentLoaded", function () {
  const menuLinks = document.querySelectorAll(".menu-item");
  menuLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const contentId = this.getAttribute("href").substring(1);

      removeCurrentLineAndContent();
      showLine(event, contentId);

      clearTimeout(timeout);
      hideElementsAfterDelay(hideTextTime);
    });
  });
});

const contactLinks = document.querySelectorAll("#contact a");
contactLinks.forEach(function (link) {
  link.addEventListener("click", handleContactLinks);
});

function handleContactLinks(event) {
  event.preventDefault();
  const url = this.href;
  window.open(url, "_blank");
}

function removeCurrentLineAndContent() {
  if (currentLine) {
    currentLine.parentNode.removeChild(currentLine);
    clearTimeout(lineTimeout);
    currentLine = null;
  }
  if (currentContent) {
    currentContent.style.opacity = "0";
    currentContent.classList.add("hidden");
    currentContent = null;
  }
}

function showLine(event, contentId) {
  const content = document.getElementById(contentId);
  const link = event.target;
  content.style.opacity = "1";
  content.classList.remove("hidden");

  let line = document.createElement("div");
  line.className = "line";
  const linkPosition = link.getBoundingClientRect();
  const contentPosition = content.getBoundingClientRect();
  // console.log(contentPosition.bottom);
  line.style.top = contentPosition.bottom + 5 + "px";
  line.style.left = linkPosition.left + 0.475 * linkPosition.width + "px";
  line.style.width = "2px";
  document.body.appendChild(line);
  currentLine = line;
  currentContent = content;

  const isPortrait = window.matchMedia("(orientation: portrait)").matches;

  if (!isPortrait) {
    content.style.left = linkPosition.left + "px";
  }

  line.style.opacity = "0";
  content.style.opacity = "0";

  setTimeout(function () {
    line.style.opacity = "1";
    content.style.opacity = "1";
  }, 50);

  lineTimeout = setTimeout(function () {
    line.style.opacity = "0";
    content.style.opacity = "0";
    content.classList.add("hidden");
    currentLine = null;
    currentContent = null;
  }, hideTextTime);
}
