import type { GoogleUser } from "./AuthContext";

export interface ToolbarProps {
    user: GoogleUser | null;
    onLogout: () => void;
}