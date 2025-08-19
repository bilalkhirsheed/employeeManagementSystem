import { createContext, useContext, useState } from 'react';

const PublicContext = createContext();

export const UsepublicContext = () => useContext(PublicContext);

export const PublicContextProvider = ({ children }) => {
    const [sidebarState, setSidebarState] = useState(false);

    return (
        <PublicContext.Provider value={{ sidebarState, setSidebarState }}>
            {children}
        </PublicContext.Provider>
    );
};
