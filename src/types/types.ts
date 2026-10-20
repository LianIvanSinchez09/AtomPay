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

//esto para el billing
export type InvoiceStatus = "Pagado" | "Pendiente" | "Vencido";

export interface InvoiceConsumption {
  value: number;
  unit: string;
}

export interface Invoice {
  id: string;
  serviceId: string;
  category: string;
  service: string;
  provider: string;
  issueDate: string;
  dueDate: string | null;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  period: string;
  consumption?: InvoiceConsumption;
  /** true cuando el comprobante no traía el importe y hay que completarlo. */
  requiresReview?: boolean;
  source?: string;
  invoiceNumber?: string | null;
  /** Link al mail original en Gmail, para ir a verlo o pagarlo. */
  emailUrl?: string | null;
}

/**
 * Categoría que quedó asociada a un remitente cuando el usuario corrigió un
 * comprobante. Se aplica a los comprobantes nuevos de esa misma dirección.
 */
export interface SenderRule {
  sender: string;
  category: string;
}

/** Servicio que el usuario agregó para que el escaneo lo busque. */
export interface ServiceSource {
  id: string;
  name: string;
  sender: string | null;
  keywords: string | null;
  category: string;
  /** Mails descartados que volvieron a la cola al agregarlo. */
  requeued?: number;
}

/** Categoría tal como está guardada (las base + las que crea el usuario). */
export interface CategoryRecord {
  id: string;
  name: string;
  description: string | null;
}

/** Servicio existente al que se puede asignar un comprobante manual. */
export interface BillableService {
  id: string;
  name: string;
  provider: string | null;
  category: string;
  invoiceCount: number;
}

/** Resultado de leer un comprobante subido a mano. */
export interface ManualInvoice {
  id: string;
  service: string;
  category: string;
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string | null;
  invoiceNumber: string | null;
  requiresReview: boolean;
}

export interface ServiceCategory {
  name: string;
  description: string;
  icon: LucideIcon;
}

/** Categoría con su id y cantidad de comprobantes, para la grilla. */
export type DisplayCategory = ServiceCategory & {
  id: string | null;
  invoiceCount: number;
};

