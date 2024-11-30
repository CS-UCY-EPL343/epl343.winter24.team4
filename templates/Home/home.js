document.addEventListener("DOMContentLoaded", () => {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll(".navbar a");
    navLinks.forEach(link => {
      link.addEventListener("click", event => {
        event.preventDefault(); // Prevent default link behavior
        const targetId = link.getAttribute("href").slice(1); // Get the target section ID
        const targetSection = document.getElementById(targetId);
  
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 80, // Adjust for fixed header height
            behavior: "smooth"
          });
        }
      });
    });
  
    // Dynamic active link highlighting
    const sections = document.querySelectorAll("main > div");
    const options = {
      threshold: 0.6
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute("id");
        if (entry.isIntersecting) {
          document
            .querySelector(`.navbar a[href="#${id}"]`)
            ?.classList.add("active");
        } else {
          document
            .querySelector(`.navbar a[href="#${id}"]`)
            ?.classList.remove("active");
        }
      });
    }, options);
  
    sections.forEach(section => {
      observer.observe(section);
    });
  
    // Toggle navbar for responsive design
    const navbar = document.querySelector(".navbar");
    const menuToggle = document.querySelector(".menu-toggle");
  
    if (menuToggle) {
      menuToggle.addEventListener("click", () => {
        navbar.classList.toggle("active");
      });
    }
  });
  