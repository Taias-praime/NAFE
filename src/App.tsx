import { RouterProvider } from "react-router-dom";
import router from "./routing";
import { useEffect, useState } from "react";
import { Toaster } from "./components/ui/toaster";
// import { DialogContext } from "./contexts/dialog.context";

const RouterGuard = ({ children }) => {

  // const [message, setMessage] = useState<string>('');
  
  const exclusions = ['login', 'reset', 'OTP', '2FA'];

  const [isLoggedIn,] = useState<boolean>(true);
  // const navigate = useNavigate();

  useEffect(() => {
    if ( !isLoggedIn && !exclusions.includes(location.pathname.split('/')[1]) ) 
      location.pathname = '/login';
  });

  return { ...children }
}

const App = () => {
  return (
    <>
      {/* <DialogContext.Provider value={}> */}
        <div className="text-foreground m-0">
          <RouterGuard>
            <RouterProvider router={router} />
          </RouterGuard>
        </div>
      {/* </DialogContext.Provider> */}
      <Toaster />
    </>
  )
}

export default App
