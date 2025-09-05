interface HeaderContainerProps {
  children: React.ReactNode;
}

const HeaderContainer = ({ children }: HeaderContainerProps) => {
  return (
    <div className="h-[10vh] flex items-center justify-between relative px-24 pt-12">
      {children}
    </div>
  );
};

export default HeaderContainer;
