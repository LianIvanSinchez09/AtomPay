import React from "react";
import Logo from "../../pages/public/Home/Logo";
import { UserCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface DialogueProps {
  input: string;
  user: "user" | "assistant";
}

const NATIVE = 400;
const ORBIT2 = 1.2;
const SLOT = 60;
const SCALE = SLOT / (NATIVE * ORBIT2);

const Dialogue = ({ input, user }: DialogueProps) => {
  const isUser = user === "user";
  const { user: authUser } = useAuth();

  const avatarUrl = authUser?.avatarUrl;

  return (
    <div
      className={`flex w-full items-end gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="w-15 h-15 shrink-0 rounded-full bg-[#2c3533] flex items-center justify-center overflow-hidden">
          <div
            style={{
              width: NATIVE,
              height: NATIVE,
              zoom: SCALE,
            }}
          >
            <Logo
              spinning={true}
              circle={false}
              bubbles={false}
              width={NATIVE}
              height={NATIVE}
            />
          </div>
        </div>
      )}
      <div
        className={`text-white p-4 rounded-2xl max-w-[75%] whitespace-pre-wrap wrap-break-word ${
          isUser ? "bg-[#181d1c] rounded-br-sm" : "bg-[#2c3533] rounded-bl-sm"
        }`}
      >
        {input}
      </div>
      {isUser && (
        <div className="w-15 h-15 shrink-0 flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Foto de perfil"
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <UserCircle size={40} className="text-gray-400" />
          )}
        </div>
      )}
    </div>
  );
};

export default Dialogue;
