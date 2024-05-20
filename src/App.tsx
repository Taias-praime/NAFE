// src/App.js
import { RouterProvider } from "react-router-dom";
import router from "./routing";
import { Toaster } from "./components/ui/toaster";
import RouterGuard from "./services/routerGuard";

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
  );
};

export default App;