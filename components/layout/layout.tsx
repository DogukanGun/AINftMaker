import React, { ReactNode } from 'react';
import CustomNavbar from "../navbar/navbar"
import CustomFooter from '../footer/footer';
interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <CustomNavbar/>
            <main>{children}</main>
            <CustomFooter/>
        </div>
    );
};

export default Layout;