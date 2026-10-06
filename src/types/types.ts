import type { LucideIcon } from "lucide-react";
import { ReactNode } from "react";


export type FooterLink = {
  label: string;
  to: string;
  end?: boolean;
};

export type FooterSection = {
  title: string;
  links: FooterLink[];
};


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
  itemsCenter?: boolean
  label: string;
  flexCol: boolean
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
  path: string;
};
// Temporal hasta que estén hechas las páginas. igual al de arriba. pegale un ojo lian.
export interface serviceItems {
  label: string;
  icon: LucideIcon;
  path: string;
}

export type NavGroupProps = {
  itemsCenter?: boolean
  items: NavGroupItem[];
  layoutId: string;
};

export interface customWidth {
  xs: "w-32"
  sm: "w-64";
  md: "w-80";
  lg: "w-96";
  xl: "w-120"
}



export type widthSize = keyof customWidth 

//este es medio temporal hasta que tengamos hechas las paginas pero eso
//va en otra branch
export interface serviceItems {
  path: string
  label: string;
  icon: LucideIcon;
} 
export interface SidepanelChildren {
  width: widthSize;
  mainTitle?: boolean;
}

export interface SidepanelProps extends SidepanelChildren {
  children: React.ReactNode
  hoverExpand?: boolean;
}

// Usuario que devuelve nuestro backend
export interface User {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  register: (userData: User, token: string) => void;
  logout: () => void;
  loading: boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}
