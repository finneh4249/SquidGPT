import parseMessage from "../utils/parseMessage";
import CollapsibleThink from "./CollapsibleThink";
import ReactMarkdown from "react-markdown";

function ChatMessages({ messages }) {
  return (
    <div className="messages">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${
            msg.sender === "user" ? "user-message" : "bot-message"
          }`}
        >
          {parseMessage(msg.text).map((segment, i) =>
            segment.type === "think" ? (
              <CollapsibleThink key={i} content={segment.content} />
            ) : segment.type === "incomplete-think" ? (
              <span key={i} className="think">
                {segment.content}
              </span>
            ) : (
              <ReactMarkdown key={i} inline>
                {segment.content}
              </ReactMarkdown>
            )
          )}
        </div>
      ))}
    </div>
  );
}

export default ChatMessages;