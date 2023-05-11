const slideShow = document.getElementById("slide-show");
const img = document.getElementById("img");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");

let currentImage = 1;

const imagesNumber = 4;

const changeImage = (direction) => {
  currentImage = (currentImage + direction + imagesNumber) % imagesNumber;
  img.src = `images/2${currentImage}.jpg`;
};

leftButton.addEventListener("click", () => {
  changeImage(-1);
});

rightButton.addEventListener("click", () => {
  changeImage(1);
});

document.addEventListener("keydown", (event) => {
  if (event.key == "ArrowLeft") {
    changeImage(-1);
  } else if (event.key == "ArrowRight") {
    changeImage(1);
  }
});

// Active Menu
const menuContainer = document.querySelector(".menu");

menuContainer.addEventListener("click", function () {
  this.classList.toggle("active");
});
