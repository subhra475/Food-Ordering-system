function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  }
  
  function addToCart(item) {
    alert(`✅ ${item} added to cart!`);
  }
  
  function revealOnScroll() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    const windowHeight = window.innerHeight * 0.9;
  
    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < windowHeight) {
        el.classList.add('visible');
      }
    });
  }
  
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('load', revealOnScroll);