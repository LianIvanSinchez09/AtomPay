
import React, { useEffect, useRef, useState } from "react";
import InputBox from "./InputBox";
import { chat } from "../../services/chatservice";
import DialogueContainer from "./DialogueContainer";
import type { Message } from "../../types/types";


const Conversation = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user.id;

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  const getRawMessage = async (input: string, userId: string) => {
    try {
      setLoading(true);

      const response = await chat(userId, input);

      return response.output;
    } catch (error) {
      console.error("Error al obtener respuesta de Atomcito:", error);
      return "No pude procesar tu mensaje. Intentá nuevamente.";
    } finally {
      setLoading(false);
    }
  };


  const handleRawMessage = async (input: string) => {
    const userMessage: Message = {
      id: Date.now(),
      input,
      user: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    const response = await getRawMessage(input, userId);
    const assistantMessage: Message = {
      id: Date.now() + 1,
      input: response || "No recibí una respuesta.",
      user: "assistant",
    };

    setMessages((prev) => [...prev, assistantMessage]);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[75%] flex flex-col">

      <div className="flex-1 overflow-y-auto p-5 pb-32">
        <DialogueContainer messages={messages} />

        {loading && (
          <div className="text-gray-400 p-3">
            Atomcito está escribiendo...
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <InputBox
        inputRef={inputRef}
        fn={handleRawMessage}
        disabled={loading}
      />

    </div>
  );
};

export default Conversation;
