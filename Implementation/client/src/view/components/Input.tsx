import { HTMLAttributes, HTMLProps, ReactElement } from "react";

type InputProps = HTMLAttributes<HTMLInputElement> &
  HTMLProps<HTMLInputElement> & {
    label: string;
  };

const Input = ({ label, ...props }: InputProps): ReactElement => {
  return (
    <div className="w-full flex justify-center">
      <input
        {...props}
        type="number"
        id={label}
        placeholder={label}
        className="text-xl font-semibold min-w-[22rem] w-1/2 max-w-[38rem] h-10 px-3 rounded-lg text-yellow-500 bg-amber-900 outline-amber-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );
};

export default Input;
