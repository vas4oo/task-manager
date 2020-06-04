import * as actionTypes from "../actionTypes";

const initialState = {
  isUserLogged: false
};

const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_LOGIN:
      return {
        ...state,
        isUserLogged: true
      };
    case actionTypes.USER_LOGOUT:
      return {
        ...state,
        isUserLogged: false
      };
  }

  return state;
};

export default commonReducer;
