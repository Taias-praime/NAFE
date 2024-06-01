import { createContext, useContext } from 'react';

const DashboardContext = createContext({} as any);

export const DashboardProvider = ({ children, reload }: { children: any, reload: () => void }) => {
    return (
        <DashboardContext.Provider value={{ reload }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboardContext = () => useContext(DashboardContext);
