// Replace this line:
// const openai = require("openai");

// With this line:
const openai = require("@openai/api");

const prompt = "Hello, ChatGPT!";

openai.apiKey = "sk-...Zmar"; // Replace with your OpenAI API key

async function sendMessage() {
	const message = document.getElementById("chatbot-input").value;
	document.getElementById("chatbot-input").value = "";
	appendMessage("User", message);

	const response = await openai.Completion.create({
		engine: "davinci",
		prompt: prompt + "\nUser: " + message,
		maxTokens: 150,
		n: 1,
		stop: "\n"
	});

	const chatbotMessage = response.choices[0].text.trim();
	appendMessage("Chatbot", chatbotMessage);
}

function appendMessage(sender, message) {
	const chatbotOutput = document.getElementById("chatbot-output");
	const messageContainer = document.createElement("div");
	messageContainer.className = "message " + sender.toLowerCase();
	messageContainer.innerHTML = "<strong>" + sender + ":</strong> " + message;
	chatbotOutput.appendChild(messageContainer);
}
