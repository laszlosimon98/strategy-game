import { HTMLAttributes, ReactElement } from "react";
import { cn } from "utils/cn";

type IconProps = HTMLAttributes<HTMLImageElement> & {
  url: string;
  width?: number;
  height?: number;
};

const Icon = ({
  url,
  width,
  height,
  className,
  ...props
}: IconProps): ReactElement => {
  return (
    <img
      {...props}
      src={url}
      className={cn(
        "cursor-pointer hover:scale-110 active:scale-100 transition-all",
        className
      )}
      width={width}
      height={height}
    />
  );
};

export default Icon;
