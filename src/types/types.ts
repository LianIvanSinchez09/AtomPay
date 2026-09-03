export interface ChatBot {
	webhookUrl: string;
	webhookConfig?: {
		method?: string;
		headers?: Record<string, string>;
	};
	target?: string;
	mode?: 'window' | 'fullscreen';
	chatInputKey?: string;
	chatSessionKey?: string;
	loadPreviousSession?: boolean;
	metadata?: Record<string, unknown>;
	showWelcomeScreen?: boolean;
	defaultLanguage?: string;
	initialMessages?: string[];
	i18n?: Record<string, unknown>;
	enableStreaming?: boolean;
	allowFileUploads?: boolean;
    
}
declare module '@n8n/chat/style.css';
