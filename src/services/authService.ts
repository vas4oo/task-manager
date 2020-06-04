import axios from "axios";
import * as HelperFunctions from "../common/functions/helperFunctions";
import jwtDecode from "jwt-decode";

class AuthService {
  // constructor() {
  //   axios.defaults.baseURL = `${Constants.tokenUrl}`;
  // }

  login(user) {
    return this.getUser(user)
      .then(data => {
        if (data.access_token) {
          this.setToken(data);
          return true;
        }
        return false;
      })
      .catch(error => Promise.reject(HelperFunctions.getErrorMessage(error)));
  }

  getUser(user) {
    return axios({
      url: `http://localhost:8000/auth/login`,
      method: "post",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      data: user
    })
      .then(res => res.data)
      .catch(error => Promise.reject(error));
  }

  createUser(user) {
    return axios({
      url: `http://localhost:8000/auth/register`,
      method: "post",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      data: user
    })
      .then(res => res.data)
      .catch(error => Promise.reject(error));
  }

  logout() {
    window.localStorage.removeItem("id_token");
  }

  isAuthenticated() {
    try {
      let token = this.getToken();
      if (token && token !== "undefined") {
        return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  }

  setToken(authResult) {
    window.localStorage.setItem("id_token", authResult.access_token);
  }

  getToken() {
    return window.localStorage.getItem("id_token");
  }

  getProfile() {
    const token = this.getToken();
    if (token && token !== "undefined") {
      return jwtDecode(token);
    } else {
      return null;
    }
  }

  getUserName() {
    let profile = this.getProfile();
    return profile &&
      profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
      ? profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
      : "";
  }

  getLoginName() {
    let profile = this.getProfile();
    return profile && profile["loginName"] ? profile["loginName"] : "";
  }

  getUserId() {
    let profile = this.getProfile();
    return profile && profile["id"] ? profile["id"] : undefined;
  }

  isAdmin() {
    let profile = this.getProfile();
    return profile && profile["isAdmin"] ? profile["isAdmin"] : false;
  }
}

export default AuthService;
