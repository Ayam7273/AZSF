// ===========================
// Al-Ihsan Chatbot
// ===========================

const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessage = document.querySelector("#send-message");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");

// Initialize user message data
const userData = {
    message: null
};

const initialInputHeight = messageInput.scrollHeight;

// ===========================
// Knowledge Base (FAQ)
// ===========================
const chatbotKnowledge = [
    // General Information
    {
        keywords: ['what is', 'al-ihsan', 'about', 'foundation', 'organisation', 'organization', 'who are you'],
        response: 'Al-Ihsan Zakat and Sadaqat Foundation is a nonprofit organization dedicated to collecting and distributing Zakat, Sadaqat, and other forms of Islamic charity to support those in need, in accordance with Islamic principles.'
    },
    {
        keywords: ['services', 'offer', 'provide', 'what do you do'],
        response: 'We provide services including:\n• Collection and distribution of Zakat and Sadaqat\n• Community welfare projects (education, healthcare, food distribution)\n• Financial assistance for the poor, widows, orphans, and other eligible beneficiaries\n• Awareness programs about the importance of Zakat and charitable giving in Islam.'
    },
    {
        keywords: ['location', 'located', 'address', 'where', 'office'],
        response: 'Our main office is located at [Insert Address]. We also operate in various regions to reach those in need. For specific locations, please visit our website or contact us.'
    },
    {
        keywords: ['contact', 'reach', 'email', 'phone', 'get in touch'],
        response: 'You can contact us via:\n• Email: info@al-ihsanzakat.com\nWe look forward to hearing from you!'
    },

    // Donations
    {
        keywords: ['donate', 'donation', 'how to give', 'contribute', 'give money', 'payment'],
        response: 'Donations can be made via:\n• Online transfer through our website\n• Bank transfer to our official accounts (details available on the website)\n• Cash or check at our office\nYou can also specify whether your donation is for Zakat, Sadaqat, or a particular project.'
    },
    {
        keywords: ['tax', 'tax-deductible', 'deductible', 'receipt'],
        response: 'Yes, donations to Al-Ihsan Zakat and Sadaqat Foundation are tax-deductible, as we are a registered nonprofit organization. Please consult your local tax laws for more information.'
    },
    {
        keywords: ['specify', 'choose', 'direct', 'where donation', 'particular project'],
        response: 'Yes! You can specify if your donation is for Zakat, Sadaqat, or a particular project. Just indicate your preference when making the donation.'
    },
    {
        keywords: ['transparency', 'trust', 'used correctly', 'accountable', 'report', 'audit'],
        response: 'We ensure transparency by publishing annual reports, audited financial statements, and updates on the impact of our projects. You can also request specific information about your donation.'
    },

    // Zakat
    {
        keywords: ['what is zakat', 'zakat mean', 'define zakat', 'explain zakat'],
        response: 'Zakat is an obligatory charity in Islam, calculated as 2.5% of a Muslim\'s qualifying wealth. It is distributed to eligible beneficiaries as prescribed in the Quran (Surah At-Tawbah 9:60).'
    },
    {
        keywords: ['zakat eligible', 'receive zakat', 'who gets zakat', 'zakat recipients', 'categories'],
        response: 'Zakat is distributed among eight categories:\n1. The poor (Al-Fuqara)\n2. The needy (Al-Masakeen)\n3. Zakat administrators\n4. Those whose hearts are to be reconciled\n5. Those in bondage\n6. Those in debt\n7. Those striving in the path of Allah\n8. Travelers in need.'
    },
    {
        keywords: ['calculate zakat', 'zakat calculation', 'how much zakat', 'zakat calculator'],
        response: 'You can use our Zakat calculator available on our website to calculate your Zakat based on your assets, liabilities, and savings. We also provide free guidance and personalized assistance — just contact us!'
    },

    // Sadaqat
    {
        keywords: ['what is sadaqat', 'sadaqat mean', 'define sadaqat', 'explain sadaqat', 'sadaqa'],
        response: 'Sadaqat refers to voluntary charity given for the sake of Allah. It can be monetary or in-kind and is not limited to a specific percentage like Zakat.'
    },
    {
        keywords: ['sadaqat non-muslim', 'non muslim', 'give to anyone', 'sadaqat anyone'],
        response: 'Yes! Sadaqat can be given to anyone in need, regardless of their faith.'
    },
    {
        keywords: ['sadaqat restrictions', 'sadaqat used for', 'sadaqat purpose'],
        response: 'Unlike Zakat, Sadaqat has fewer restrictions and can be used for various charitable purposes including education, health, and disaster relief.'
    },

    // Beneficiaries
    {
        keywords: ['beneficiaries', 'who do you help', 'who receives', 'recipients', 'helped'],
        response: 'Our beneficiaries include:\n• Poor and needy individuals\n• Orphans and widows\n• Families affected by disasters or crises\n• Students in need of financial assistance\n• Patients requiring medical aid.'
    },
    {
        keywords: ['select beneficiaries', 'choose beneficiaries', 'verify', 'eligibility criteria'],
        response: 'Beneficiaries are selected through a rigorous verification process that ensures they meet the eligibility criteria for receiving Zakat or Sadaqat.'
    },
    {
        keywords: ['sponsor', 'sponsorship', 'specific beneficiary', 'orphan', 'sponsor project'],
        response: 'Yes! You can sponsor a specific beneficiary (e.g., an orphan) or contribute to a particular project. Contact us at info@al-ihsanzakat.com for details on sponsorship opportunities.'
    },

    // Volunteering
    {
        keywords: ['volunteer', 'volunteering', 'help out', 'get involved'],
        response: 'Absolutely! We welcome volunteers to assist with fundraising, event management, beneficiary outreach, and administrative support. Fill out the volunteer application form on our website or contact us directly.'
    },
    {
        keywords: ['sign up volunteer', 'how to volunteer', 'apply volunteer', 'join as volunteer'],
        response: 'To become a volunteer, fill out the application form on our website or contact us directly at info@al-ihsanzakat.com. Our team will guide you through the process.'
    },

    // Feedback & Complaints
    {
        keywords: ['feedback', 'complaint', 'complain', 'suggestion', 'review'],
        response: 'We value your feedback! You can reach us via:\n• Email: info@al-ihsanzakat.com\n• Feedback form on our website\nAll feedback and complaints are addressed within 7 working days.'
    },
    {
        keywords: ['how long', 'response time', 'reply', 'working days', 'promptly'],
        response: 'We are committed to addressing all feedback and complaints within 7 working days.'
    },

    // Greetings
    {
        keywords: ['hello', 'hi', 'hey', 'salam', 'assalamu', 'greetings'],
        response: 'Wa Alaikum Assalam! Welcome to Al-Ihsan Zakat and Sadaqat Foundation. How can I help you today? You can ask me about Zakat, Sadaqat, donations, volunteering, or our beneficiaries.'
    },
    {
        keywords: ['thank', 'thanks', 'jazakallah', 'jazak'],
        response: 'Jazakallah Khair! If you have any more questions, feel free to ask. We\'re always happy to help.'
    }
];

// Default response when no keyword matches
const defaultResponse = 'I\'m here to help! You can ask me about:\n• What is Zakat or Sadaqat?\n• How to donate\n• Who are our beneficiaries?\n• How to volunteer\n• How to contact us\n\nTry asking something like "How do I donate?" or "What is Zakat?"';

// ===========================
// Match user message to knowledge base
// ===========================
function getChatbotResponse(userMessage) {
    const lower = userMessage.toLowerCase().trim();
    for (const item of chatbotKnowledge) {
        if (item.keywords.some(kw => lower.includes(kw))) {
            return item.response;
        }
    }
    return defaultResponse;
}

// ===========================
// Create message element
// ===========================
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};

// ===========================
// Handle outgoing user messages
// ===========================
const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();
    if (!userData.message) return;

    messageInput.value = "";
    messageInput.dispatchEvent(new Event("input"));

    // Display user message
    const outgoingContent = `<div class="message-text"></div>`;
    const outgoingMessageDiv = createMessageElement(outgoingContent, "user-message");
    outgoingMessageDiv.querySelector(".message-text").innerText = userData.message;
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    // Show thinking indicator then display bot response
    setTimeout(() => {
        const botContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"/></svg>
        <div class="message-text">
            <div class="thinking-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>`;

        const incomingMessageDiv = createMessageElement(botContent, "bot-message", "thinking");
        chatBody.appendChild(incomingMessageDiv);
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

        // Simulate response delay then show answer
        setTimeout(() => {
            const messageElement = incomingMessageDiv.querySelector(".message-text");
            const response = getChatbotResponse(userData.message);
            messageElement.innerText = response;
            incomingMessageDiv.classList.remove("thinking");
            chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
        }, 600);
    }, 600);
};

// ===========================
// Event Listeners
// ===========================
messageInput.addEventListener("input", () => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    document.querySelector(".chat-form").style.borderRadius =
        messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});

messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if (e.key === "Enter" && !e.shiftKey && userMessage && window.innerWidth > 768) {
        handleOutgoingMessage(e);
    }
});

sendMessage.addEventListener("click", (e) => handleOutgoingMessage(e));
closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));