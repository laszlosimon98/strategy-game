import { HTMLAttributes, PropsWithChildren, ReactElement } from "react";
import { cn } from "utils/cn";

type NamePlateProps = PropsWithChildren & HTMLAttributes<HTMLDivElement> & {};

const NamePlate = ({ children, className }: NamePlateProps): ReactElement => {
  return (
    <div
      className={cn(
        "font-semibold bg-amber-900 text-yellow-500 text-2xl rounded-xl h-14 min-w-44 px-4 flex justify-center items-center",
        className
      )}
    >
      {children}
    </div>
  );
};

export default NamePlate;
