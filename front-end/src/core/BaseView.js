import React from 'react';
import PropTypes from 'prop-types'
import SiteMenu from "./SiteMenu";
import AWS from "aws-sdk";
import config from "../config";
import LexChat from "react-lex-plus";

AWS.config.update({
    region: "us-east-1",
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: config.IDENTITY_POOL_ID,
    }),
})

function BaseView({
                      titleString = '',
                      descriptionString = '',
                      className = 'bg-dark text-white p-4',
                      children,
                  }) {
    return (
        <>
            <div className={"bg-dark"}>
                <SiteMenu/>
                <div className="container-fluid">
                    <div className="jumbotron bg-dark text-white text-center">
                        <h2 className="display-4">{titleString}</h2>
                        <p className="lead">{descriptionString}</p>
                        <div className={className}>{children}</div>
                    </div>
                </div>
                <div>
                    <LexChat
                        botName="dalSafeDeposit"
                        IdentityPoolId="us-east-1:dfcec534-7f21-4dfc-8009-5d0ea32d5458"
                        placeholder="Placeholder text"
                        backgroundColor="#FFFFFF"
                        height="430px"
                        region="us-east-1"
                        headerText="Chat with our Dal-Safe bot"
                        headerStyle={{
                            backgroundColor: "#5cb85c",
                            fontSize: "15px"
                        }}
                        greeting={
                            "Hello, welcome to dal safe!! how can I help? You can say things like 'what is my account balance or registration status' to get more info"
                        }

                    />
                </div>
            </div>
        </>
    );
}

BaseView.propTypes = {
    descriptionString: PropTypes.string,
    children: PropTypes.any,
    className: PropTypes.any,
    titleString: PropTypes.string
}

export default BaseView;