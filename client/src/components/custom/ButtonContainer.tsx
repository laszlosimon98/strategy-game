interface ButtonContainerProps {
  children: React.ReactNode;
}

const ButtonContainer = ({ children }: ButtonContainerProps) => {
  return (
    <div className="flex flex-col h-[90vh] justify-center space-y-4 w-md mx-auto">
      {children}
    </div>
  );
};

export default ButtonContainer;
