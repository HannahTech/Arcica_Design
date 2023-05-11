const projects = Array.from(document.getElementsByClassName("project"));

projects.forEach((project, index) => {
  project.style.backgroundImage = `url(images/3${index}.jpg)`;
  project.addEventListener("click", () => open("project.html"));
});


