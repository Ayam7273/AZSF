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
            text: `
                Frequently Asked Questions (FAQs)
                General Information 
                Q1: What is Al-Ihsan Zakat and Sadaqat Foundation? 
                A: Al-Ihsan Zakat and Sadaqat Foundation is a nonprofit organization dedicated to collecting and distributing Zakat, Sadaqat, and other forms of Islamic charity to support those in need, in accordance with Islamic principles. 

                Q2: What services does the foundation offer? 
                A: We provide services including: 

                Collection and distribution of Zakat and Sadaqat. 

                Community welfare projects such as education, healthcare, and food distribution. 

                Financial assistance for the poor, widows, orphans, and other eligible beneficiaries. 

                Awareness programs about the importance of Zakat and charitable giving in Islam. 

                Q3: Where is Al-Ihsan Zakat and Sadaqat Foundation located? 
                A: Our main office is located at [Insert Address]. We also operate in various regions to reach those in need. For specific locations, please visit our website or contact us. 

                Q4: How can I contact the foundation? 
                A: You can contact us via: 
                
                Email: info@al-ihsanzakat.com

                Phone: +44 7455 884242

                Donations 

                Q5: How can I donate to the foundation? 
                A: Donations can be made via: 

                Online transfer through our website. 

                Bank transfer to our official accounts (details available on the website). 

                Cash or check at our office. 

                Q6: Is my donation tax-deductible? 
                A: Yes, donations to Al-Ihsan Zakat and Sadaqat Foundation are tax-deductible, as we are a registered nonprofit organization. Please consult your local tax laws for more information. 

                Q7: Can I specify where my donation goes? 
                A: Yes, you can specify if your donation is for Zakat, Sadaqat, or a particular project. Just indicate your preference when making the donation. 

                Q8: How do I know my donation is used correctly? 
                A: We ensure transparency by publishing annual reports, audited financial statements, and updates on the impact of our projects. You can also request specific information about your donation. 

                

                Zakat-Specific Questions 

                Q9: What is Zakat? 
                A: Zakat is an obligatory charity in Islam, calculated as 2.5% of a Muslim’s qualifying wealth. It is distributed to eligible beneficiaries as prescribed in the Quran (Surah At-Tawbah 9:60). 

                Q10: Who is eligible to receive Zakat? 
                A: Zakat is distributed among the eight categories of recipients mentioned in the Quran, including: 

                The poor (Al-Fuqara). 

                The needy (Al-Masakeen). 

                Zakat administrators. 

                Those whose hearts are to be reconciled. 

                Those in bondage (slaves or captives). 

                Those in debt. 

                Those striving in the path of Allah. 

                Travelers in need. 

                Q11: How do I calculate my Zakat? 
                A: Use our Zakat calculator available on our website to calculate your Zakat based on your assets, liabilities, and savings. 

                Q12: Does Al-Ihsan Foundation help with Zakat calculation? 
                A: Yes, we provide free guidance and tools for calculating Zakat. You can contact us for personalized assistance. 

                

                Sadaqat-Specific Questions 

                Q13: What is Sadaqat? 
                A: Sadaqat refers to voluntary charity given for the sake of Allah. It can be monetary or in-kind and is not limited to a specific percentage like Zakat. 

                Q14: Can Sadaqat be given to non-Muslims? 
                A: Yes, Sadaqat can be given to anyone in need, regardless of their faith. 

                Q15: Are there any restrictions on how Sadaqat can be used? 
                A: Unlike Zakat, Sadaqat has fewer restrictions and can be used for various charitable purposes, including education, health, and disaster relief. 

                

                Beneficiaries 

                Q16: Who are the beneficiaries of the foundation? 
                A: Our beneficiaries include: 

                Poor and needy individuals. 

                Orphans and widows. 

                Families affected by disasters or crises. 

                Students in need of financial assistance. 

                Patients requiring medical aid. 

                Q17: How do you select beneficiaries? 
                A: Beneficiaries are selected through a rigorous verification process that ensures they meet the eligibility criteria for receiving Zakat or Sadaqat. 

                Q18: Can I sponsor a specific beneficiary or project? 
                A: Yes, you can choose to sponsor a specific beneficiary (e.g., an orphan) or contribute to a particular project. Contact us for details on sponsorship opportunities. 

                

                Volunteering 

                Q19: Can I volunteer with Al-Ihsan Zakat and Sadaqat Foundation? 
                A: Absolutely! We welcome volunteers to assist with various activities, including fundraising, event management, beneficiary outreach, and administrative support. 

                Q20: How can I sign up as a volunteer? 
                A: To become a volunteer, fill out the application form on our website or contact us directly. Our team will guide you through the process. 

                

                Feedback and Complaints 

                Q21: How can I provide feedback or file a complaint? 
                A: We value your feedback. You can reach out to us via: 

                Email: info@al-ihsanzakat.com 

                Phone: +44 7455 884242 

                Feedback form on our website. 

                Q22: Will my feedback or complaint be addressed promptly? 
                A: Yes, we are committed to addressing all feedback and complaints within 7 working days. 
            `
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
