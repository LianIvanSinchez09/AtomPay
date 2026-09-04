import type { LucideIcon } from 'lucide-react';

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

export type Props = {
	props?: React.ReactNode
	children?: React.ReactNode
}

export type MotionButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
};

export type NavItemProps = {
  label: string;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
  layoutId: string;
};

export type TransitionButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
};

export type SectionLabelProps = {
  children: React.ReactNode;
};

export type NavGroupItem = {
  label: string;
  icon: LucideIcon;
};

export type NavGroupProps = {
  items: NavGroupItem[];
  activeLabel: string;
  onSelect: (label: string) => void;
  layoutId: string;
};