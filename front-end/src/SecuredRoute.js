import React from 'react';
import {isUserAuthenticated} from "./user/UserNetwork";
import {Navigate, Outlet} from "react-router-dom";
import {toast} from "react-hot-toast";

function SecuredRoute() {
    const auth = isUserAuthenticated();
    if (!auth) {
        toast.error("You have to be logged in to access this page");
    }
    return auth ? <Outlet/> : <Navigate to={"/login"}/>
}

export default SecuredRoute;