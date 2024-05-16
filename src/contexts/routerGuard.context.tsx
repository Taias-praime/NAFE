import { Dispatch, createContext, useState } from "react";
import { IUser } from "../models/interfaces";

type RouterGuardContextType = {
    loginState: IUser | null;
    setLoginState: Dispatch<React.SetStateAction<IUser | null>>;
};

export const RouterGuardContext = createContext<RouterGuardContextType | null>(null);

const LoginProvider = ({ children }: { children: any }) => {

    const [loginState, setLoginState] = useState<IUser | null>(null);

    return (
        <RouterGuardContext.Provider value={{ loginState, setLoginState }}>
            {...children}
        </RouterGuardContext.Provider>
    )
}

export default LoginProvider;