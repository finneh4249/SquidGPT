function CollapsibleThink({ content }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="collapsible-think">
      <button onClick={() => setExpanded((prev) => !prev)}>
        {expanded ? "Hide Thinking" : "Show Thinking"}
      </button>
      {expanded && (
        <div className="think">
          <ReactMarkdown inline>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default CollapsibleThink;