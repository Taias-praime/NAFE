import SideMenu from "./components/ui-custom/sideMenu"
import { Header } from "./components/ui-custom/header"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react";

const AdminLayout = ({ children }: any) => {

    // make sure '/' leads to '/dashboard'

    const { pathname } = useLocation();
    const nav = useNavigate();

    useEffect(() => {
        if (pathname === '/') nav('/dashboard')
    }, []);

  return (
      <div className="flex">
          <SideMenu />
          <div className="flex flex-col w-full">
              <Header />
              {children}
          </div>
      </div>

  )
}

export default AdminLayout