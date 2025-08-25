async function fetchDonations() {
    try {
      const response = await fetch("https://azsf-stripe-webhook-server.onrender.com/donations"); 
      const donations = await response.json();
      
      donations.forEach((donation, index) => {
        showDonationPopup(donation.name, donation.city, index);
      });
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  }

  function showDonationPopup(name, city, index) {
    const container = document.getElementById("donation-popup-container");
    const popup = document.createElement("div");
    popup.classList.add("donation-popup");
    popup.innerText = `${name} from ${city} just donated! 🎉`;

    setTimeout(() => {
      popup.remove();
    }, 5000);

    container.appendChild(popup);
  }

  // Fetch new donations every 10 seconds
  setInterval(fetchDonations, 10000);
