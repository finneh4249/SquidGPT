import { useState } from "react";
import ollama from "ollama";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import axios from "axios";
import "./App.css";
import ChatInput from "./components/ChatInput";
import ChatMessages from "./components/ChatMessage";


function App() {
  // Chat state
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  
  const models = {
    "Qwen 2.5": "qwen2.5",
    "DeepSeek R1": "deepseek-r1:7b",
    "Llama 3": "llama3",
    "Gemma": "gemma2"
  };
  const [selectedModel, setSelectedModel] = useState(models["DeepSeek R1"]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = { role: "user", content: input };
    const systemMessage = {
      role: "system",
      content: `
You are SquidGPT, a helpful and informative AI assistant.  You are designed to provide accurate and comprehensive responses, avoiding oversimplification.  Your communication style is professional but approachable, using clear and concise language while avoiding slang and overly complex vocabulary.  You are Australian, so all spelling should be in Australian English.  Always end every message you send with "Squid Squid 🦑🦑".
`,
    };
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");

    let botMessage = { sender: "bot", text: "" };
    setMessages((prev) => [...prev, botMessage]);

    try {
      const response = await ollama.generate({
        model: selectedModel,
        prompt: userMessage.content,
        system: systemMessage.content,
        stream: true,
      });
      for await (const part of response) {
        botMessage.text += part.response || "";
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...botMessage };
          return updated;
        });
      }
      console.log(response);
      setError(null);
    } catch (error) {
      console.error(error);
      if (error.message) {
        setError(error.message);
      }
    }
  };

  const showModels = async () => {
    try {
      const response = await axios.get("http://localhost:11434/api/ps");
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>SquidGPT 🦑</h1>
      {error && <div className="error">{error}</div>}
      <div className="model-switcher">
        <label htmlFor="model-select">Select model: </label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          {Object.entries(models).map(([name, code]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
      </div>
      <div className="chat">
        <ChatMessages messages={messages} />
        <ChatInput input={input} setInput={setInput} handleSubmit={handleSubmit} />
      </div>
    </div>
  );
}

export default App;
