import { useState } from "react";
import ollama from "ollama";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import axios from "axios";
import "./App.css";
import ChatInput from "./components/ChatInput";
import ChatMessages from "./components/ChatMessage";

/* Updated parseMessage to mark an incomplete think segment */

// Updated collapsible component for think segments (for complete segments)



function App() {
  // Chat state
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you?" },
  ]);
  const [input, setInput] = useState("");

  // Submit handler using ollama.generate
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = { role: "user", content: input };
    // Define system prompt instructing the model for its name
    const systemMessage = {
      role: "system",
      content: `
You are SquidGPT, a helpful and informative AI assistant.  You are designed to provide accurate and comprehensive responses, avoiding oversimplification.  Your communication style is professional but approachable, using clear and concise language while avoiding slang and overly complex vocabulary.  You are Australian, so all spelling should be in Australian English.  Always end every message you send with "Squid Squid 🦑🦑".
`,
    };
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");

    // Add a bot message placeholder
    let botMessage = { sender: "bot", text: "" };
    setMessages((prev) => [...prev, botMessage]);

    try {
      const response = await ollama.generate({
        model: "deepseek-r1:7b",
        prompt: userMessage.content,
        system: systemMessage.content,
        stream: true,
      });
      // Process the streaming generate response with safety check
      for await (const part of response) {
        botMessage.text += part.response || "";
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...botMessage };
          return updated;
        });
      }
      console.log(response)
    } catch (error) {
      console.error(error);
      // Optionally handle error in UI.
    }
  };

  const showModels = async () => {
    try {
      const response = await axios.get("http://localhost:11434/api/ps");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      // Optionally handle error in UI.
    }
  };

  return (
    <div className="App">
      <h1>SquidGPT 🦑</h1>
      <div className="chat">
        <ChatMessages messages={messages} />
        <ChatInput input={input} setInput={setInput} handleSubmit={handleSubmit} />
      </div>
    </div>
  );
}

export default App;
