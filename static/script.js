const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

function addMessage(text, className) {
    const message = document.createElement("div");
    message.className = `message ${className}`;
    message.innerText = text;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const message = userInput.value.trim();

    if (!message) return;

    addMessage(message, "user-message");
    userInput.value = "";

    addMessage("JARVIS is thinking...", "bot-message");

    const botMessages = document.querySelectorAll(".bot-message");
    const thinkingMessage = botMessages[botMessages.length - 1];

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        thinkingMessage.innerText = data.reply;
        speakText(data.reply);

    } catch (error) {
        thinkingMessage.innerText = "Sorry sir, something went wrong.";
    }
}

function speakText(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}

function startVoice() {
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser. Use Chrome.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function(event) {
        const voiceText = event.results[0][0].transcript;
        userInput.value = voiceText;
        sendMessage();
    };
}

userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
