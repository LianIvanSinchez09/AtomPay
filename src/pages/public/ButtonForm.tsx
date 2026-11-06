import React from "react";

interface ButtonFormProps {
  fn: () => void;
  text: string;
}

const ButtonForm = ({ fn, param, text }: ButtonFormProps) => {
  const handleCheck = () => {
    fn(param)
  }
  return (
    <button
      type="button"
      onClick={handleCheck}
      className=" 
      rounded-lg 
      cursor-pointer
      bg-black 
      py-2.5 
      text-sm 
      font-semibold 
      text-white 
      transition-colors 
      hover:bg-neutral-800 
      focus-visible:outline-2 
      focus-visible:outline-offset-2 
      focus-visible:outline-[#4D869C] 
      disabled:cursor-not-allowed 
      disabled:opacity-60 
      dark:bg-[#A7D129] 
      dark:text-black 
      dark:hover:bg-[#bde43a] 
      dark:focus-visible:outline-[#A7D129]"
    >
      {text}
    </button>
  );
};

export default ButtonForm;
