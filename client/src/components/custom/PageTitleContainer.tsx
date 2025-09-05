interface PageTitleContainerProps {
  children: React.ReactNode;
}

const PageTitleContainer = ({ children }: PageTitleContainerProps) => {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pt-12">
      {" "}
      {children}
    </div>
  );
};

export default PageTitleContainer;
