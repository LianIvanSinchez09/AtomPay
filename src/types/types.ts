import type { LucideIcon } from "lucide-react";

export interface ChatBot {
  webhookUrl: string;

  webhookConfig?: {
    method?: string;
    headers?: Record<string, string>;
  };

  target?: string;
  mode?: "window" | "fullscreen";
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

declare module "@n8n/chat/style.css";

export type Props = {
  props?: React.ReactNode;
  children?: React.ReactNode;
};

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
  collapsed: boolean;
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
  path: string;
};
// Temporal hasta que estén hechas las páginas. igual al de arriba. pegale un ojo lian.
export interface serviceItems {
  label: string;
  icon: LucideIcon;
  path: string;
}

export type NavGroupProps = {
  items: NavGroupItem[];
  layoutId: string;
   collapsed: boolean;
};

export interface customWidth {
  sm: "w-64";
  md: "w-80";
  lg: "w-96";
}

export type widthSize = keyof customWidth;



export interface SidepanelProps {
  width: widthSize;
  children: React.ReactNode;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}