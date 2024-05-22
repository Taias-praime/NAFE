import { useMemo } from "react";
import { local } from "../lib/utils";

const RouterGuard = ({ children }: any) => {
    const isLoggedIn = local('user');
    const exclusions = useMemo(() => ['login', 'reset', 'OTP', '2FA'], []);

    const currentPath = location.pathname.split('/')[1];
    
    if (!isLoggedIn && !exclusions.includes(currentPath))
        location.pathname = '/login';
    else return children;
};

export default RouterGuard;
