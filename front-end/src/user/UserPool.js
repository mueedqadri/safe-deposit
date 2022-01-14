import config from '../config';
import {CognitoUserPool} from "amazon-cognito-identity-js";

const userPoolInfo = {
    UserPoolId: config.COGNITO_USER_POOL_ID,
    ClientId: config.COGNITO_CLIENT_ID
}

export default new CognitoUserPool(userPoolInfo);