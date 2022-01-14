import React from "react";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from "./Home";
import ImageUpload from "./user/ImageUpload";
import SecuredRoute from "./SecuredRoute";
import Profile from "./user/Profile";
import Feed from "./user/Feed";
import Register from "./user/Register";
import Login from "./user/Login";
import NotFound from "./NotFound";
import {Toaster} from "react-hot-toast";
import ThirdFactorPage from "./user/ThirdFactorPage";

function DalRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Home/>}/>
                {/*Secured Routes Go Here!!*/}
                <Route path="/" element={<SecuredRoute/>}>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/upload" element={<ImageUpload/>}/>
                    <Route path="/3fa" element={<ThirdFactorPage/>}/>
                </Route>

                <Route path="/chat" element={<Feed/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="*" element={<NotFound/>}/>

            </Routes>
            <Toaster
                position="top-right"
                reverseOrder={true}
                toastOptions={{
                    duration: 3000
                }}
            />
        </BrowserRouter>
    )
}

export default DalRoutes;