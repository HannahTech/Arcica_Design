const projects = Array.from(
  document.getElementsByClassName("project-image-container")
);

projects.forEach((project, index) => {
  project.addEventListener("click", () => open("project.html"));
});
