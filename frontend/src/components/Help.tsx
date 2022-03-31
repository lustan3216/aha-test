import React from 'react';

const Help: React.FC<{messages: string[]}> = function ({messages}) {
  if (!messages) return null;
  return (
    <ul
      style={{
        margin: 0,
        padding: 0,
        listStyleType: 'none',
      }}
    >
      {messages.map(message => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  );
};

export default Help;
