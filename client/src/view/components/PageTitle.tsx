import { PropsWithChildren, ReactElement } from "react";

type PageTitleProps = PropsWithChildren & {};

const PageTitle = ({ children }: PageTitleProps): ReactElement => {
  return (
    <div className="w-full flex justify-center pt-8 items-end">
      <h1 className="text-4xl font-semibold bg-amber-900 text-yellow-500 w-64 h-20 rounded-xl flex justify-center items-center">
        {children}
      </h1>
    </div>
  );
};

export default PageTitle;
