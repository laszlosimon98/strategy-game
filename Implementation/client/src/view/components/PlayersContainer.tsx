import { PropsWithChildren, ReactElement } from "react";

type PlayersContainerProps = PropsWithChildren & {};

const PlayersContainer = ({
  children,
}: PlayersContainerProps): ReactElement => {
  return (
    <div className="min-w-[22rem] w-1/2 max-w-[38rem] h-52 bg-amber-900 text-yellow-500">
      {children}
    </div>
  );
};

export default PlayersContainer;
