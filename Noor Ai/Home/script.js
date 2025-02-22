document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector(".chat-input span");
    const chatbox = document.querySelector(".chatbox");
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const chatbotCloseBtn = document.querySelector(".close-btn");

    if (chatInput && sendChatBtn && chatbox) {
        let userMessage;
        const inputInitHeight = chatInput.scrollHeight;

        // Create a chat <li> element with passed message and className
        const createChatLi = (message, className) => {
            const chatLi = document.createElement("li");
            chatLi.classList.add("chat", className);
            let chatContent = className === "outgoing" ? `<p></p>` : `<span><img src="assets/img/Original Star.png" alt="" class="chat__logo__img"></span><p></p>`;
            chatLi.innerHTML = chatContent;
            chatLi.querySelector("p").textContent = message;
            return chatLi;
        }

        const generateResponse = () => {
            const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBUl7jRQJ4scwzNWNgsVQTUHjUDlZ7WW_0`;
            const incomingChatLi = chatbox.querySelector(".incoming:last-child p");

            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        role: "user",
                        parts: [{ text: userMessage }]
                    }]
                }),
            };

            fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
                incomingChatLi.textContent = data.candidates[0].content.parts[0].text;
            }).catch(() => {
                incomingChatLi.textContent = "Oops! Something went wrong. Please try again.";
                incomingChatLi.classList.add("error");
            }).finally(() => {
                // Scroll to the bottom of the chatbox
                chatbox.scrollTop = chatbox.scrollHeight;
            });
        }

        const handleChat = () => {
            userMessage = chatInput.value.trim();
            if (userMessage) {
                // Append the user's message to the chatbox
                chatbox.appendChild(createChatLi(userMessage, "outgoing"));
                // Scroll to the bottom of the chatbox
                chatbox.scrollTop = chatbox.scrollHeight;
                // Clear the input field
                chatInput.value = "";

                setTimeout(() => {
                    // Display "..." message while waiting for the response
                    chatbox.appendChild(createChatLi("Typing ...", "incoming"));
                    // Scroll to the bottom of the chatbox
                    chatbox.scrollTop = chatbox.scrollHeight;
                    generateResponse();
                }, 600);
            }
        }

        chatInput.addEventListener("input", () => {
            // Adjust the height of the input textarea based on its content
            chatInput.style.height = `${inputInitHeight}px`;
            chatInput.style.height = `${chatInput.scrollHeight}px`;
        });

        chatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleChat();
            }
        });

        sendChatBtn.addEventListener("click", () => {
            console.log("Send button clicked");
            handleChat();
        });

        chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
        chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
        sendChatBtn.addEventListener("click", handleChat);
    } else {
        console.error("Chat input, send button, or chatbox not found in the DOM.");
    }
});