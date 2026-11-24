import { useEffect, useRef } from "react";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";
import { ChatBot } from "../../types/types";
import { JSX } from "react";
import InputBox from "../../components/Atomcito/InputBox.tsx";
import Conversation from "../../components/Atomcito/Conversation.tsx";

const chatBotConfig: ChatBot = {
  webhookUrl:
    "https://atominc.app.n8n.cloud/webhook/24025a49-a0ec-457a-ac95-4f0ead3baabe/chat",
  webhookConfig: {
    method: "POST",
    headers: {},
  },
  target: "#n8n-chat",
  mode: "window",
  chatInputKey: "chatInput",
  chatSessionKey: "sessionId",
  loadPreviousSession: true,
  metadata: {},
  showWelcomeScreen: false,
  defaultLanguage: "en",
  initialMessages: ["Hola! 👋", "Soy Atomcito, ¿En qué te puedo ayudar hoy?"],
  enableStreaming: false,
};

const Atomcito = (): JSX.Element => {
  return(
    <div className="absolute w-full right-0">
      <Conversation/>
    </div>
  )
};

export default Atomcito;
