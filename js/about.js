// Impact Section
// Data for quotes and clients
const data = [
  {
    quote: "Eirmod magna dolores et lorem sit, amet duo justo et tempor clita stet. Sanctus eos labore et diam amet no labore lorem sit clita erat ipsum.",
    clientName: "Akhi Ayman",
    clientImage: "assets/impact-pfp1.png",
  },
  {
    quote: "Aliqu diam amet eos labore justo magna lorem. Diam sanctus justo et sed est clita lorem sit.",
    clientName: "Sister Fatima",
    clientImage: "assets/impact-pfp2.png",
  },
  {
    quote: "Stet lorem magna sit rebum et, labore duo lorem diam lorem eos. Diam amet lorem erat justo clita sed ipsum.",
    clientName: "Brother Omar",
    clientImage: "assets/impact-pfp3.png",
  },
];

let currentIndex = 0;

// Elements
const quoteElement = document.querySelector(".quote");
const clientNameElement = document.querySelector(".client strong");
const clientImageElement = document.querySelector(".client img");
const dots = document.querySelectorAll(".pagination .dot");
const prevButton = document.querySelector(".fa-chevron-left");
const nextButton = document.querySelector(".fa-chevron-right");

// Update the slider content
function updateSlider(index) {
  quoteElement.textContent = data[index].quote;
  clientNameElement.textContent = data[index].clientName;
  clientImageElement.src = data[index].clientImage;

  // Update pagination dots
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

// Handle navigation
function navigateSlider(direction) {
  if (direction === "next") {
    currentIndex = (currentIndex + 1) % data.length; // Loop back to start
  } else if (direction === "prev") {
    currentIndex = (currentIndex - 1 + data.length) % data.length; // Loop back to end
  }
  updateSlider(currentIndex);
}

// Event listeners for navigation buttons
prevButton.addEventListener("click", () => navigateSlider("prev"));
nextButton.addEventListener("click", () => navigateSlider("next"));

// Event listeners for pagination dots
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentIndex = index;
    updateSlider(index);
  });
});

// Initialize the slider
updateSlider(currentIndex);
