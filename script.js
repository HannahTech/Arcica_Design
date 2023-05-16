const imageCount = 12;
const imagesFolder = "./images/";

fetch(imagesFolder)
  .then((response) => response.text())
  .then((data) => {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(data, "text/html");
    const images = [];
    const imageLinks = Array.from(htmlDoc.getElementsByTagName("a"));
    const imageFiles = imageLinks
      .map((link) => link.getAttribute("href"))
      .filter((filename) => filename.match(/\.(jpe?g|png)$/i));

    while (images.length < imageCount) {
      const randomIndex = Math.floor(Math.random() * imageFiles.length);
      const randomImage = imageFiles[randomIndex];
      imageFiles.splice(randomIndex, 1);

      const imageName = randomImage.replace("/images/", "");

      images.push(imageName);
    }
    console.log(images);

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
        slides[i]
          .querySelectorAll("img.overlay")
          .forEach((img) => img.remove());
        slides[i]
          .querySelectorAll("img.move_left")
          .forEach((img) => img.remove());
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
  })
  .catch((error) => {
    console.error("Error fetching image filenames:", error);
  });

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
