
import React from "react";
import { ArrowRight } from "lucide-react";
import { InputBoxProps } from "../../types/types";


const InputBox = ({ inputRef, fn, disabled }: InputBoxProps) => {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const message = inputRef.current?.value.trim();

    if (!message || disabled) return;

    fn(message);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-0 right-0 p-5 flex bg-linear-to-t  "
    >
      <div className="bg-[#181d1c] flex justify-between p-3 w-full rounded-full">

        <input
          ref={inputRef}
          disabled={disabled}
          className="bg-[#2c3533] w-full rounded-full m-2 p-3 text-white outline-none disabled:opacity-50"
          type="text"
          placeholder="Pregunta a Atomcito..."
        />

        <button
          type="submit"
          disabled={disabled}
          className="bg-[#2c3533] cursor-pointer rounded-full flex items-center justify-center p-4 text-white disabled:opacity-50"
        >
          <ArrowRight />
        </button>

      </div>
    </form>
  );
};

export default InputBox;
