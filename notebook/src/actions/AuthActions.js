import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import {
    REGISTER_EMAIL_CHANGED,
    REGISTER_PASSWORD_CHANGED,
    REGISTER_CONFIRM_PASSWORD_CHANGED,
    REGISTER_USER,
    REGISTER_INVALID_EMAIL,
    REGISTER_INVALID_PASSWORD,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_EMAIL_CHANGED,
    LOGIN_PASSWORD_CHANGED,
    LOGIN_USER,
    RECOVERY_EMAIL_CHANGED,
    RECOVER_ACCOUNT,
    LOGOUT_USER_SUCCESS,
    PASSWORD_SENT_SUCCESS,
    PASSWORD_SENT_FAIL
} from './types';

/////////////////////////////////////////////////////// REGISTER ///////////////////////////////////

export const registerEmailChanged = (text) => (
    {
        type: REGISTER_EMAIL_CHANGED,
        payload: text
    }
);

export const registerPasswordChanged = (text) => (
    {
        type: REGISTER_PASSWORD_CHANGED,
        payload: text
    }
);

export const registerConfirmPasswordChanged = (text) => (
    {
        type: REGISTER_CONFIRM_PASSWORD_CHANGED,
        payload: text
    }
);

export const registerUser = ({ registerEmailText, registerPasswordText, registerConfirmPasswordText }) => {
    const hasAtChar = registerEmailText.includes('@');
    const hasDotChar = registerEmailText.includes('.');

    if (registerEmailText.legth < 5 || !hasAtChar || !hasDotChar) {
        return (dispatch) => {
            dispatch({ type: REGISTER_INVALID_EMAIL });
        };
    }

    if (registerPasswordText.length < 6 || (registerPasswordText !== registerConfirmPasswordText)) {
        return (dispatch) => {
            dispatch({ type: REGISTER_INVALID_PASSWORD });
        };
    }

    return (dispatch) => {
        dispatch({ type: REGISTER_USER });

        firebase.auth().createUserWithEmailAndPassword(registerEmailText, registerPasswordText)
                    .then(user => loginUserSuccess(dispatch, user))
                    .catch(error => loginUserFail(dispatch, error));
    };
};

/////////////////////////////////////////////////////// LOGIN ///////////////////////////////////

export const loginEmailChanged = (text) => (
    {
        type: LOGIN_EMAIL_CHANGED,
        payload: text
    }
);

export const loginPasswordChanged = (text) => (
    {
        type: LOGIN_PASSWORD_CHANGED,
        payload: text
    }
);

export const loginUser = ({ loginEmailText, loginPasswordText }) => {
    return (dispatch) => {
        dispatch({ type: LOGIN_USER });

        firebase.auth().signInWithEmailAndPassword(loginEmailText, loginPasswordText)
            .then(user => loginUserSuccess(dispatch, user))
            .catch(error => loginUserFail(dispatch, error));
    };
};

/////////////////////////////////////////////////////// LOG OUT ///////////////////////////////////

export const logoutUser = () => {
    return (dispatch) => {
        firebase.auth().signOut()
            .then(() => logoutUserSuccess(dispatch))
            .catch(error => console.log(error));
    };
};

/////////////////////////////////////////////////////// RECOVERY ///////////////////////////////////

export const recoveryEmailChanged = (text) => (
    {
        type: RECOVERY_EMAIL_CHANGED,
        payload: text
    }
);

export const recoverAccountTapped = ({ recoveryEmail }) => {
    return (dispatch) => {
        dispatch({ type: RECOVER_ACCOUNT });

        firebase.auth().sendPasswordResetEmail(recoveryEmail)
            .then(() => sendPasswordSuccess(dispatch))
            .catch(error => sendPasswordFail(dispatch, error));
    };
};

///////////////////////////////////////////// CHECK IF LOGGED IN ///////////////////////////////////

// export const checkIfLoggedIn = () => {
//     return (dispatch) => {
//         const user = firebase.auth().currentUser;

//         if (user) {
//             console.log(user)
//         } else {
//             console.log('no user')
//         }
//     };
// };

///////////////////////////////////////////// DELETE USER ///////////////////////////////////

const user = firebase.auth().currentUser;

export const deleteUser = (dispatch) => {
    user.delete()
        .then(() => console.log('user deleted'))
        .catch(error => console.log(error));
};

/////////////////////////////////////////////////////// HELPERS ///////////////////////////////////

const loginUserFail = (dispatch, error) => {
    console.log(error.code);
    console.log(error.message);
    dispatch({ type: LOGIN_USER_FAIL });
};

const loginUserSuccess = (dispatch, user) => {
    dispatch({ type: LOGIN_USER_SUCCESS, payload: user });
    Actions.main({ type: 'reset' });
};

const logoutUserSuccess = (dispatch) => {
    dispatch({ type: LOGOUT_USER_SUCCESS });
    Actions.auth({ type: 'reset' });
};

const sendPasswordSuccess = (dispatch) => {
    dispatch({ type: PASSWORD_SENT_SUCCESS });
};

const sendPasswordFail = (dispatch, error) => {
    let message;

    if (error.code === 'auth/invalid-email') {
        message = 'Invalid Email';
    } else if (error.code === 'auth/user-not-found') {
        message = 'User Not Found';
    } else {
        message = 'Password Reset Failed';
    }

    dispatch({ type: PASSWORD_SENT_FAIL, payload: message });
};
