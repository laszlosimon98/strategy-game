import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="box-border bg-accent">
      <Outlet />
    </div>
  );
};

export default Layout;
