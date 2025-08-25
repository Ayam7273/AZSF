let getvalue = (id) => {
  let value = document.getElementById(id).value;
  if (value === "" || isNaN(value)) {
      return 0;
  } else {
      return parseFloat(value);
  }
};


// Function to fetch metal prices
async function fetchPrices() {
  try {
    const response = await fetch("https://metals-api.com/api/latest?access_key=y2t7bxv2g5nmggsfvcj2dgo8731mvmce5k60nb9n2602e5m30ax1f7cdyz81&base=USD&symbols=XAU,XAG");
    const data = await response.json();

    if (!data.rates || !data.rates.XAU || !data.rates.XAG) {
      throw new Error("Invalid API response");
    }

    // Convert inverted values
    const silverPricePerOunceUSD = 1 / data.rates.XAG;

    // Convert price per ounce to price per gram
    const silverPricePerGramUSD = (silverPricePerOunceUSD / 34.5).toFixed(2);

    // Nisab values
    silverNisabValue = (silverPricePerGramUSD * 612.36).toFixed(2); // Store globally

    // Update HTML  
    document.getElementById("todaynisabvalue").innerText = `Today's Nisab is: $${silverNisabValue}`;

  } catch (error) {
    console.error("Error fetching prices:", error);
  }
}

// Auto-update every hour
fetchPrices();
setInterval(fetchPrices, 3600000);

let calculate = () => {
  let amt_nisab = silverNisabValue;
  let amt_home = getvalue("amount_home");
  let amt_bank = getvalue("amount_bank");
  let amt_shares = getvalue("amount_shares");
  let amt_merchandise = getvalue("amount_merchandise");
  let amt_gold = getvalue("amount_gold");
  let amt_property = getvalue("amount_property");
  let amt_other = getvalue("amount_other");
  let amt_debts = getvalue("amount_debts");
  let amt_expenses = getvalue("amount_expenses");

  let amt_assets_gross =
      amt_home +
      amt_bank +
      amt_shares +
      amt_merchandise +
      amt_gold +
      amt_property +
      amt_other;

  let amt_assets_net = amt_assets_gross - amt_debts - amt_expenses;
  let amt_eligible = amt_assets_net > amt_nisab ? Math.ceil(amt_assets_net) : 0;
  let amt_zakat = amt_eligible > 0 ? Math.ceil(amt_eligible * 0.025) : 0;

  let formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
  });

  // Update Eligible Amount and Zakat Amount Fields
  document.getElementById("amount_eligible").value =
      amt_eligible > 0 ? formatter.format(amt_eligible) : "Ineligible";
  document.getElementById("amount_zakat").value =
      amt_eligible > 0 ? formatter.format(amt_zakat) : "Ineligible";

  // Update CTA Button Behavior
  const donateButton = document.getElementById("donate_button");
  if (amt_eligible > 0) {
      donateButton.innerText = "Pay Now";
      donateButton.dataset.amount = amt_zakat;
      donateButton.href = "https://buy.stripe.com/8wMdUNg259KY0zScMO"; // Direct to donation page
      donateButton.classList.add("active-cta");
  } else {
      donateButton.innerText = "Calculate";
      donateButton.removeAttribute("href"); // Remove link if ineligible
      donateButton.classList.remove("active-cta");
  }
};

// Reset All Input Fields
let resetFields = () => {
  const inputs = document.querySelectorAll(".login__input-text");
  inputs.forEach((input) => {
      input.value = "";
  });
  document.getElementById("amount_eligible").value = "Ineligible";
  document.getElementById("amount_zakat").value = "Ineligible";

  const donateButton = document.getElementById("donate_button");
  donateButton.innerText = "Calculate";
  donateButton.removeAttribute("href");
  donateButton.classList.remove("active-cta");
};

// Event Listener to Update Results on Input Change
const inputs = document.querySelectorAll(".login__input-text");
inputs.forEach((input) => {
  input.addEventListener("input", calculate);
});

// Update Nisab Display on Page Load
updateNisabDisplay();

// Re-run exchange rate fetch every 10 minutes to keep it fresh
setInterval(updateNisabDisplay, 600000);
