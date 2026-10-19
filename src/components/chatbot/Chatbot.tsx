import { useEffect, useRef } from 'react'
import '@n8n/chat/style.css';
import './chatbotStyles.css';
import { createChat } from '@n8n/chat';
import { ChatBot } from '../../types/types';
import { JSX } from 'react';

const chatBotConfig: ChatBot = {
	webhookUrl: 'https://atominc.app.n8n.cloud/webhook/24025a49-a0ec-457a-ac95-4f0ead3baabe/chat',
	webhookConfig: {
		method: 'POST',
		headers: {}
	},
	target: '#n8n-chat',
	mode: 'window',
	chatInputKey: 'chatInput',
	chatSessionKey: 'sessionId',
	loadPreviousSession: true,
	metadata: {},
	showWelcomeScreen: false,
	defaultLanguage: 'en',
	initialMessages: [
		'Hola! 👋',
		'Soy Atomcito, ¿En qué te puedo ayudar hoy?'
	],
	enableStreaming: false,
}


const Chatbot = (): JSX.Element => {
	const mounted = useRef(false);

	useEffect(() => {
		// StrictMode monta el efecto dos veces en desarrollo, y @n8n/chat crea
		// una app de Vue por cada llamada: sin este guard se duplica el chat.
		if (mounted.current) return;
		mounted.current = true;

		// Por si quedó DOM de un montaje anterior.
		document.querySelector('#n8n-chat')?.replaceChildren();

		createChat(chatBotConfig);
	}, []);

	return (<div id="n8n-chat"></div>);
}

export default Chatbot