import React from 'react';
import notFoundLogo from './resources/not-found.png'
import {Link} from "react-router-dom";

function NotFound() {
    return (
        <div className={"text-white"}>
            <img src={notFoundLogo} className={"notFound"} alt={"404 Page not found"}/>
            <Link to={"/"} className={"btn btn-lg btn-primary"}>Go Home</Link>

        </div>
    );
}

export default NotFound;