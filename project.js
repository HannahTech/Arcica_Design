const slideShow = document.getElementById("slide-show");
const img = document.getElementById("img");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");

let currentImage = 0;

const imagesNumber = 5;

const images = [
  "043-Arcica Vyner Rd 1",
  "084-Arcica Vyner Rd",
  "143-Arcica Vyner Rd",
  "192-Arcica Vyner Rd",
  "313-Arcica Vyner Rd",
];
const changeImage = (direction) => {
  currentImage = (currentImage + direction + imagesNumber) % imagesNumber;
  const imageName = images[currentImage];
  img.src = `images/${imageName}.jpg`;
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
