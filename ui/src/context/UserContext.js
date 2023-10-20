import React from "react";
import CategoryServices from "../services/CategoryServices";
var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################

function loginUser(dispatch, login, password, history, setIsLoading, setError, roleType) {
  setError(false);
  setIsLoading(true);
  if (!!login && !!password) {
    const  userDetails =   {"email":login,"password":password, "role":roleType}
    CategoryServices.creteUserLogin(userDetails).then((res) => {
      localStorage.setItem('userDetail', JSON.stringify(res));
      localStorage.setItem('id_token', res.token)
      setError(null)
      setIsLoading(false)
      dispatch({ type: 'LOGIN_SUCCESS' });
      if(res && res.registrationType === 'coaching'){
        history.push('/app/coaching') ;
      }else{
        history.push('/app/park') ;
      }
     
       window.location.reload(false);


    }).catch((err) => {
      alert(err.response.data.message)
      setIsLoading(false);
      history.push('/sriqr/login')
    });
  } 
}
function signOut(dispatch, history) {
  localStorage.removeItem("id_token");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/sriqr/login");
}
