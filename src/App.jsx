import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

const App = () => {
	useEffect(() => {
		createChat({
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
		'Hi there! 👋',
		'My name is Nathan. How can I assist you today?'
	],
	i18n: {
		en: {
			title: 'Hi there! 👋',
			subtitle: "Start a chat. We're here to help you 24/7.",
			footer: '',
			getStarted: 'New Conversation',
			inputPlaceholder: 'Type your question..',
		},
	},
	enableStreaming: false,
		});
	}, []);

	return (<div id="n8n-chat"></div>);
};

export default App