const firstDiv = document.getElementById("first");
const imageDescription = document
  .getElementById("AllDescriptions")
  .querySelectorAll(".imageDesc"); //

let currentImage = 0;
const imagesNumber = 6;
const transitionTime = 4000;

const dots = Array.from(document.getElementsByClassName("dot"));
imageDescription[currentImage].style.opacity = "1"; //imageDescription

const transition = (nextImage = -1) => {

  imageDescription[currentImage].style.opacity = "0"; //imageDescription
  currentImage = nextImage < 0 ? (currentImage + 1) % imagesNumber : nextImage;
  imageDescription[currentImage].style.opacity = "1"; //imageDescription
  firstDiv.style.backgroundImage = `url(images/0${currentImage}.webp)`;
};

let interval = setInterval(transition, transitionTime);

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    clearInterval(interval);
    transition(index);
    interval = setInterval(transition, transitionTime);
  });
});

// const projects = Array.from(document.getElementsByClassName("project"));

// const projectOffsets = projects.map((project) => {
//   return project.offsetTop + project.offsetHeight;
// });

// projects.forEach((project, index) => {
//   project.style.backgroundImage = `url(images/3${index}.jpg)`;
//   project.addEventListener("click", () => open("project.html"));
//   // project.style.transform = "translate(0px, 100px)";
// });

// window.addEventListener("scroll", () => {
//   projects.forEach((project, index) => {
//     if (innerHeight + scrollY >= projectOffsets[index]) {
//       if (index % 2) {
//         project.style.transition =
//           "transform 1.5s ease 0.5s, opacity 1.5s ease 0.5s, background-size 1.5s ease";
//       } else {
//         project.style.transition =
//           "transform 1.5s ease, opacity 1.5s ease, background-size 1.5s ease";
//       }
//       project.style.opacity = "1";
//       project.style.transform = "translate(0px, -100px)";
//     }
//   });
// });

// Active Menu
const menuContainer = document.querySelector(".menu");

menuContainer.addEventListener("click", function () {
  this.classList.toggle("active");
});
