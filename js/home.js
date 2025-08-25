// 0. Preloader
document.addEventListener('DOMContentLoaded', function() {
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('progressBar');
  let progress = 0;
  
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 100) progress = 100;
    
    progressBar.style.width = progress + '%';
    
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 300);
      }, 500);
    }
  }, 100);
});


// 1. Navbar scroll effect
window.addEventListener('scroll', function() {
  const nav = document.querySelector('.nav');
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// 2.  Animated word script for Hero Section
document.addEventListener('DOMContentLoaded', function() {
  const animatedWord = document.getElementById('animatedWord');
  const words = ['Purposeful', 'Impactful', 'Significant'];
  let currentIndex = 0;
  
  animatedWord.innerHTML = '';
  
  function cycleWords() {
    animatedWord.innerHTML = '';
    
    // Create and show current word
    const span = document.createElement('span');
    span.textContent = words[currentIndex];
    span.style.animation = 'slideInOut 2s ease-in-out';
    animatedWord.appendChild(span);
    
    // Move to next word
    currentIndex = (currentIndex + 1) % words.length;
  }
  
  cycleWords();
  
  // Set interval to cycle 1k/secs
  setInterval(cycleWords, 2000);
});

// 3. Hamburger menu
const nav = document.querySelector(".nav"),
navOpenBtn = document.querySelector(".navOpenBtn"),
navCloseBtn = document.querySelector(".navCloseBtn");

navOpenBtn.addEventListener("click", () => {
  nav.classList.add("openNav");
  nav.classList.remove("openSearch");
  searchIcon.classList.replace("uil-times", "uil-search");
});
navCloseBtn.addEventListener("click", () => {
  nav.classList.remove("openNav");
});

// 4. Impact Stats
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".impact-stats .stat h2");
  const duration = 5000;

  counters.forEach((counter, index) => {
    const text = counter.textContent;
    const targetNumber = parseInt(text.replace(/[^\d]/g, ''));
    const isCurrency = text.includes("£");
    let start = 0;
    const increment = targetNumber / (duration / 16.66);

    const updateCounter = () => {
      start += increment;
      if (start >= targetNumber) {
        counter.textContent = formatNumber(targetNumber, isCurrency, index === 0);
      } else {
        counter.textContent = formatNumber(start, isCurrency, index === 0);
        requestAnimationFrame(updateCounter);
      }
    };

    updateCounter();
  });

  function formatNumber(number, isCurrency, addK) {
    const formatted = Math.round(number).toLocaleString();
    if (isCurrency) {
      return addK ? `£ ${formatted}K` : `£ ${formatted}`;
    }
    return formatted;
  }
});

// 5. Slider for News Section
new Swiper('.card-wrapper', {
  loop: true,
  spaceBetween: 30,

  // Pagination bullets
  pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true
  },

  // Navigation arrows
  navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
  },

  // Responsive breakpoints
  breakpoints: {
      0: {
          slidesPerView: 1
      },
      768: {
          slidesPerView: 2
      },
      1024: {
          slidesPerView: 3
      }
  }
});

// 6. FAQ Section
let li = document.querySelectorAll(".faq-text li");
for (var i = 0; i < li.length; i++) {
  li[i].addEventListener("click", (e)=>{
    let clickedLi;
    if(e.target.classList.contains("question-arrow")){
      clickedLi = e.target.parentElement;
    }else{
      clickedLi = e.target.parentElement.parentElement;
    }
   clickedLi.classList.toggle("showAnswer");
  });
}

// 7. Auto-flip hero image every 60 seconds
document.addEventListener('DOMContentLoaded', function() {
  const flipContainer = document.querySelector('.flip-container');
  
  if (flipContainer) {
    setInterval(() => {
      flipContainer.classList.toggle('flipped');
    }, 5000); 
  }
});

// 8. Scroll-triggered animations
document.addEventListener('DOMContentLoaded', function() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  // Observe all elements with animation classes
  const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in, .empowerment-card, .faq-text li');
  animatedElements.forEach(el => observer.observe(el));
});

