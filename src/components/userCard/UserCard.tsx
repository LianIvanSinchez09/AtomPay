import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const UserCard = () => {
    const {
        user,
        logout,
    } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <div className="flex items-center gap-3 rounded-xl border border-[#CDE8E5] bg-white p-3 shadow-sm dark:border-[#616F39] dark:bg-[#000000]">

            <img
                src={user.picture}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover"
            />

            <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-semibold text-[#4D869C] dark:text-white">
                    {user.name}
                </p>

                <p className="truncate text-xs opacity-60">
                    {user.email}
                </p>

            </div>

            <button
                type="button"
                onClick={logout}
                title="Cerrar sesión"
                className="rounded-lg p-2 text-[#4D869C] transition hover:bg-[#EEF7FF] dark:text-[#A7D129] dark:hover:bg-[#3E432E]"
            >
                <LogOut className="h-5 w-5" />
            </button>
        </div>
    );
};

export default UserCard;