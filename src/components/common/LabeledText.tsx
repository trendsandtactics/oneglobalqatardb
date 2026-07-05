import React from 'react';

// Renders "Label: rest of text" with the label bolded in primary color,
// matching the original hardcoded <strong>Label:</strong> pattern used
// across the service pages. Text without a colon renders as plain text.
const LabeledText = ({ text }: { text: string }) => {
  const colonIdx = text.indexOf(':');
  if (colonIdx > 0 && colonIdx < 60) {
    return (
      <>
        <strong className="text-primary">{text.slice(0, colonIdx + 1)}</strong>
        {text.slice(colonIdx + 1)}
      </>
    );
  }
  return <>{text}</>;
};

export default LabeledText;
