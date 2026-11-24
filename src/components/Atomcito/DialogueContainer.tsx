
import React from "react";
import Dialogue from "./Dialogue";

interface Message {
  id: number;
  input: string;
  user: "user" | "assistant";
}

interface DialogueContainerProps {
  messages: Message[];
}

const DialogueContainer = ({ messages }: DialogueContainerProps) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {messages.map((message) => (
        <Dialogue
          key={message.id}
          input={message.input}
          user={message.user}
        />
      ))}
    </div>
  );
};

export default DialogueContainer;
