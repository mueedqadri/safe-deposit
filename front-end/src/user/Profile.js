import React from 'react';
import {isUserAuthenticated} from "./UserNetwork";
import BaseView from "../core/BaseView";

function Profile() {
    const user = isUserAuthenticated();
    const src = `https://ui-avatars.com/api/?background=5cb85c&name=${user.name.replace(" ", "+")} `
    return (
        <BaseView titleString={"Profile Details"}
                  descriptionString={"All your details in one page"}>
            <div className="col-md-6">
                <div className="card  ">
                    <div>
                        <img className="card-img-top card-image"
                             src={src}
                             alt="Card image cap"/>
                    </div>

                    <ul className="list-group list-group-flush text-success">
                        Name <li className="list-group-item">{user.name}</li>
                        Email <li className="list-group-item">{user.email}</li>
                        Box number <li
                        className="list-group-item">{user.boxNumber}</li>
                    </ul>
                </div>
            </div>
        </BaseView>
    )
}

export default Profile;