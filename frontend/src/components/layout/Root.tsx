import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
// import BottomNav from "../BottomNav";

const Root: React.FC = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        document.getElementById('scrolltop')?.scrollIntoView();
    }, [pathname]);

    const noNavRoutes = ['/login', '/register'];
    const showNav = !noNavRoutes.includes(pathname);

    return (
        <>
            <div id="scrolltop"></div>
            <div className='App'>
                <Outlet />
            </div>
            {/* {showNav && <BottomNav />} */}
        </>
    );
};

export default Root;