import React from 'react';
import {Link} from 'react-router-dom';
import {isUserAuthenticated, userLogout} from "../user/UserNetwork";
import {toast} from "react-hot-toast";
import {useNavigate} from "react-router";


const pageLinks = [
    {
        name: 'Home',
        path: "/"
    }, {
        name: 'Profile',
        path: "/profile"
    }, {
        name: 'Chat',
        path: '/chat'
    }, {
        name: 'Images upload',
        path: '/upload'
    }
]


function SiteMenu() {
    const navigate = useNavigate();
    const logout = () => {
        const {email} = isUserAuthenticated();
        console.log("In logout", email);
        userLogout(email).then(() => {
            toast.success("User logged out")
        })

        // Route to Login Page!
        navigate('/login');
    }

    return (
        <div className={"bg-secondary"}>
            <ul className={"nav nav-tabs bg-dark nav-text"}>
                {isUserAuthenticated() ? (
                    <>
                        {
                            pageLinks.map(page => (
                                <li key={page.name} className={"nav-item"}>
                                    <Link
                                        className={"nav-link"}
                                        to={page.path}
                                    >
                                        {page.name}
                                    </Link>
                                </li>
                            ))
                        }

                        <li className="nav-link text-success btn"
                            onClick={logout}>
                            Log out
                        </li>

                    </>
                ) : (
                    <>

                        <li key="login" className="nav-item">

                            <Link className="nav-link"
                                  to={"/login"}> Login </Link>

                        </li>

                        <li key="register" className="nav-item">

                            <Link className="nav-link"
                                  to={"/register"}> Register </Link>

                        </li>

                    </>

                )}
            </ul>
        </div>
    );
}


export default SiteMenu;