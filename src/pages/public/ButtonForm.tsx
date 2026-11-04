import React from 'react'

interface ButtonFormProps {
  fn: () => void;
  text: string;
}

const ButtonForm = ({ fn, text }: ButtonFormProps) => {
  return (
    <button
      type="button"
      onClick={fn}
      className="..."
    >
      {text}
    </button>
  );
};

export default ButtonForm;