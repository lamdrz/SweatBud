import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const Root: React.FC = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        document.getElementById('scrolltop')?.scrollIntoView();
    }, [pathname]);

    return (
        <>
            <div id="scrolltop"></div>
            <div className='App'>
                <Outlet />
            </div>
        </>
    );
};

export default Root;