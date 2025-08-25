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

// 0.5. Navbar scroll effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
});

// 1. Hamburger menu
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

// 2. NavBar Drop down
document.addEventListener("DOMContentLoaded", () => {
    const dropdown = document.querySelector(".dropdown");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const dropdownLink = dropdown.querySelector("a");
  
    // Toggle dropdown visibility on click
    dropdownLink.addEventListener("click", (e) => {
        dropdownMenu.classList.toggle("show");
    });
  
    // Close dropdown if clicking outside
    document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
            dropdownMenu.classList.remove("show");
        }
    });
});

// chat bot
const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessage = document.querySelector("#send-message");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");
// API setup
const API_KEY = "AIzaSyA-HsUiGePJoQa0u0Yw1HBT_SNHHLmYxn8";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
// Initialize user message and file data
const userData = {
    message: null
};
// Store chat history
const chatHistory = [
    {
        role: "model",
        parts: [{
            text: `Frequently Asked Questions (FAQs)
                  Al-Ihsan Zakat and Sadaqah Foundation
                  General Questions
                  1. What is Al-Ihsan Zakat and Sadaqah Foundation?
                  Answer: Al-Ihsan Zakat and Sadaqah Foundation is a non-profit organisation dedicated to helping those in need by facilitating charitable giving in alignment with Islamic principles.
                  2. What is the purpose of Al-Ihsan?
                  Answer:  Our purpose is to enable donors to fulfil their charitable obligations while uplifting communities through sustainable programs, emergency relief, and individual support.
                  3. Who can benefit from the foundation’s support?
                  Answer: Our aid is directed to vulnerable individuals and communities, including the poor, the hungry, the sick, orphans, and those affected by crises or disasters.
                  4. How does Al-Ihsan ensure donations are used effectively?
                  Answer: We prioritize transparency and accountability by vetting beneficiaries, conducting regular audits, and providing donors with detailed reports on the impact of their contributions.
  
                  Donations
                  5. How can I donate to Al-Ihsan?
                  Answer: Donations can be made through:
                  •	Our website: [Insert website link]
                  •	Bank transfer
                  •	In-person visits to our offices
                  6. Can I choose how my donation is used?
                  Answer:  Yes, you can specify whether your donation supports causes like education, healthcare, food aid, water projects, orphan care, or general relief.
                  7. Is there a minimum amount for donations?
                  Answer: There is no minimum donation amount—every contribution makes a difference.
                  8. Can I set up recurring donations?
                  Answer: Yes, you can schedule recurring donations to provide consistent support for the causes you care about. 
                  9. Are my donations tax-deductible?
                  Answer: In most countries, donations to Al-Ihsan are tax-deductible. We provide receipts to assist with your tax filings.
                  10. Can I donate anonymously?
                  Answer: Yes, we respect donor privacy and allow for anonymous contributions.
                  11. Does Al-Ihsan accept non-monetary donations?
                  Answer: Yes, we accept in-kind donations, such as food, clothing, and medical supplies, for specific campaigns. Please contact us for details. 
  
                  Programs and Services
                  12. What types of projects does Al-Ihsan support?
                  Answer: Our initiatives include:
                  •	Feeding programs for families and individuals in need
                  •	Clean water projects, such as building wells and filtration systems
                  •	Educational support for children and adults
                  •	Healthcare and medical aid programs
                  •	Orphan care and shelter provision
                  •	Emergency relief for disasters or crises
                  13. Can I donate on behalf of someone else?
                  Answer: Yes, you can donate in honour of a loved one, whether they are living or deceased.
                  14. Does Al-Ihsan support environmental projects?
                  Answer: Yes, we run projects like tree planting and clean water initiatives to support sustainable development and protect the environment.
                  15. How does Al-Ihsan select beneficiaries?
                  Answer: We conduct thorough needs assessments to identify individuals and communities most in need, ensuring aid reaches the right recipients. 
                  16. Can I see or visit projects my donations is being spent on?
                  Answer:  In some cases, donor visits can be arranged based on project location and logistical feasibility.
  
                  Transparency and Accountability
                  17. How does Al-Ihsan ensure transparency?
                  Answer: We provide detailed financial reports, regular project updates, and impact assessments to keep donors informed. [provide link to the policy]
                  18. Does Al-Ihsan charge administrative fees?
                  Answer: A small portion of donations may be allocated to cover administrative costs to ensure operational efficiency, unless specified otherwise.
                  19. Will I receive updates about my donation?
                  Answer: Yes, we keep donors updated with progress reports, photos, and videos of the projects they support.
  
                  Miscellaneous
                  20. What is the difference between Zakat and Sadaqah?
                  While Zakat is an obligatory act of worship for eligible Muslims, Sadaqah is a voluntary charity that can be given at any time for any cause. At Al-Ihsan, we distribute both according to Islamic principles and donor preferences.
                  21. Does Al-Ihsan offer tools to calculate Zakat?
                  Yes, we provide an online Zakat calculator to help you determine the exact amount you owe based on your assets.
                  22. How can I volunteer with Al-Ihsan?
                  Answer: We welcome volunteers to support our initiatives. You can check our website or contact us directly to learn about available opportunities.
                  23. How do I contact Al-Ihsan for more information?
                  Answer:  You can reach us through our email: info@al-ihsanzakat.com`
        }],
    },
];
const initialInputHeight = messageInput.scrollHeight;
// Create message element with dynamic classes and return it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};
// Generate bot response using API
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");
    // Add user message to chat history
    chatHistory.push({
        role: "user",
        parts: [{ text: `Using the details provided above, please address this query: ${userData.message}` }]
    });
    // API request options
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: chatHistory,
        }),
    };
    try {
        // Fetch bot response from API
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);
        // Extract and display bot's response text
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        messageElement.innerText = apiResponseText;
        // Add bot response to chat history
        chatHistory.push({
            role: "model",
            parts: [{ text: apiResponseText }],
        });
    } catch (error) {
        // Handle error in API response
        console.log(error);
        messageElement.innerText = error.message;
        messageElement.style.color = "#ff0000";
    } finally {
        // Reset user's file data, removing thinking indicator and scroll chat to bottom
        incomingMessageDiv.classList.remove("thinking");
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    }
};
// Handle outgoing user messages
const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();
    messageInput.value = "";
    messageInput.dispatchEvent(new Event("input"));
    // Create and display user message
    const messageContent = `<div class="message-text"></div>`;
    const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
    outgoingMessageDiv.querySelector(".message-text").innerText = userData.message;
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    // Simulate bot response with thinking indicator after a delay
    setTimeout(() => {
        const messageContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
              <path
                d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"/></svg>
            <div class="message-text">
              <div class="thinking-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
            </div>`;
        const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
        chatBody.appendChild(incomingMessageDiv);
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
        generateBotResponse(incomingMessageDiv);
    }, 600);
};
// Adjust input field height dynamically
messageInput.addEventListener("input", () => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    document.querySelector(".chat-form").style.borderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});
// Handle Enter key press for sending messages
messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if (e.key === "Enter" && !e.shiftKey && userMessage && window.innerWidth > 768) {
        handleOutgoingMessage(e);
    }
});
sendMessage.addEventListener("click", (e) => handleOutgoingMessage(e));
closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
