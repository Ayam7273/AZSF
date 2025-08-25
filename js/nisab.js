document.addEventListener("DOMContentLoaded", function() {
    const questions = document.querySelectorAll(".nisab-question h3");
    questions.forEach(question => {
        question.addEventListener("click", function() {
            const answer = this.nextElementSibling;
            const arrowIcon = this.querySelector(".arrow i");

            answer.classList.toggle("active");

            if (answer.classList.contains("active")) {
                answer.style.display = "block";
                arrowIcon.classList.remove("fa-chevron-down");
                arrowIcon.classList.add("fa-chevron-up");
            } else {
                answer.style.display = "none";
                arrowIcon.classList.remove("fa-chevron-up");
                arrowIcon.classList.add("fa-chevron-down"); 
            }

            question.classList.toggle("open");
        });
    });
});

// Function to fetch gold and silver prices from Metal-API
async function fetchPrices() {
    try {
      const response = await fetch('https://metals-api.com/api/latest?access_key=y2t7bxv2g5nmggsfvcj2dgo8731mvmce5k60nb9n2602e5m30ax1f7cdyz81&base=USD&symbols=XAU,XAG');
      const data = await response.json();
  
      if (!data.rates || !data.rates.XAU || !data.rates.XAG) {
        throw new Error("Invalid API response");
      }
  
      // Correcting the API response: Invert values
      const goldPricePerOunceUSD = 1 / data.rates.XAU;
      const silverPricePerOunceUSD = 1 / data.rates.XAG;
      
      // Convert USD to GBP
      let fetchExchangeRate = async () => {
        try {
            const response = await fetch(
                "https://api.exchangerate-api.com/v4/latest/USD"
            ); // Fetch the latest exchange rates for USD
            const data = await response.json();
            const rateGBP = data.rates.GBP; // Get the rate for GBP to USD
            return rateGBP;
        } catch (error) {
            console.error("Error fetching exchange rate:", error);
            return 0.8; // Fallback rate if API fails
        }
      };
      
      const usdToGbp = await fetchExchangeRate(); 
      const goldPricePerOunceGBP = goldPricePerOunceUSD * usdToGbp;
      const silverPricePerOunceGBP = silverPricePerOunceUSD * usdToGbp;
  
      // Convert troy ounce (35 grams) to price per gram
      const goldPricePerGramGBP = (goldPricePerOunceGBP / 34.5).toFixed(2);
      const silverPricePerGramGBP = (silverPricePerOunceGBP / 34.5).toFixed(2);
  
      // Nisab values
      const goldNisabValue = (goldPricePerGramGBP * 87.48).toFixed(2); // 87.48g for gold
      const silverNisabValue = (silverPricePerGramGBP * 612.36).toFixed(2); // 612.36g for silver
  
      // Updating HTML content
      document.getElementById('gold-value').innerText = `£${goldNisabValue}`;
      document.getElementById('gold-price').innerText = `Based on the gold price of £${goldPricePerGramGBP} per gram`;
  
      document.getElementById('silver-value').innerText = `£${silverNisabValue}`;
      document.getElementById('silver-price').innerText = `Based on the silver price of £${silverPricePerGramGBP} per gram`;
  
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  }
  
  // Fetch prices on page load
  fetchPrices();
  
  // Auto-update every hour
  setInterval(fetchPrices, 3600000); // 1 hour (3600000 ms)
  
