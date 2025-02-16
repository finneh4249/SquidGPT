function parseMessage(text) {
  const parts = [];
  const startTag = "<think>";
  const endTag = "</think>";
  let pos = 0;
  while (pos < text.length) {
    const startIndex = text.indexOf(startTag, pos);
    if (startIndex === -1) {
      parts.push({ type: "text", content: text.substring(pos) });
      break;
    }
    if (startIndex > pos) {
      parts.push({ type: "text", content: text.substring(pos, startIndex) });
    }
    const endIndex = text.indexOf(endTag, startIndex);
    if (endIndex === -1) {
      // No closing tag: mark as incomplete think with placeholder text
      parts.push({ type: "incomplete-think", content: "..." });
      break;
    } else {
      parts.push({
        type: "think",
        content: text.substring(startIndex + startTag.length, endIndex),
      });
      pos = endIndex + endTag.length;
    }
  }
  return parts;
}

export default parseMessage;