import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import {
  showErrMsg,
  showSuccessMsg,
} from "../../utils/notification/Notification";
import { dispatchLogin } from "../../../redux/actions/authAction";
import { useDispatch } from "react-redux";
// import { GoogleLogin } from "react-google-login";
// import FacebookLogin from "react-facebook-login";
import { GoogleLogin } from "@react-oauth/google";
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";

const initialState = {
  email: "",
  password: "",
  err: "",
  success: "",
};

function Login() {
  const [user, setUser] = useState(initialState);
  const dispatch = useDispatch();
  const history = useHistory();

  const { email, password, err, success } = user;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/user/login", { email, password });
      setUser({ ...user, err: "", success: res.data.msg });

      localStorage.setItem("firstLogin", true);

      dispatch(dispatchLogin());
      history.push("/");
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
    }
  };

  // const responseGoogle = async (response) => {
  //   try {
  //     const res = await axios.post("/user/google_login", {
  //       tokenId: response.tokenId,
  //     });

  //     setUser({ ...user, error: "", success: res.data.msg });
  //     localStorage.setItem("firstLogin", true);

  //     dispatch(dispatchLogin());
  //     history.push("/");
  //   } catch (err) {
  //     err.response.data.msg &&
  //       setUser({ ...user, err: err.response.data.msg, success: "" });
  //   }
  // };

  const responseGoogle = async (response) => {
    try {
      const res = await axios.post("/user/google_login", {
        tokenId: response.credential,
      });

      setUser({ ...user, error: "", success: res.data.msg });
      localStorage.setItem("firstLogin", true);

      dispatch(dispatchLogin());
      history.push("/");
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
    }
  };

  const responseFacebook = async (response) => {
    try {
      const { accessToken, userID } = response.data;
      const res = await axios.post("/user/facebook_login", {
        accessToken,
        userID,
      });

      setUser({ ...user, error: "", success: res.data.msg });
      localStorage.setItem("firstLogin", true);

      dispatch(dispatchLogin());
      history.push("/");
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
    }
    console.log(response);
  };

  return (
    <div className="login_page">
      <h2>Login</h2>
      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="text"
            placeholder="Enter email address"
            id="email"
            value={email}
            name="email"
            onChange={handleChangeInput}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            id="password"
            value={password}
            name="password"
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <button type="submit">Login</button>
          <Link to="/forgot_password">Forgot your password?</Link>
        </div>
      </form>

      <div className="hr">Or Login With</div>

      <div className="social">
        {/* <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText="Login with google"
          onSuccess={responseGoogle}
          cookiePolicy={"single_host_origin"}
        /> */}
        <GoogleLogin onSuccess={responseGoogle} />

        {/* <FacebookLogin
          appId={process.env.REACT_APP_FACEBOOK_ID}
          autoLoad={true}
          fields="name,email,picture"
          callback={responseFacebook}
        /> */}

        <LoginSocialFacebook
          onResolve={responseFacebook}
          appId={process.env.REACT_APP_FACEBOOK_ID}
        >
          <FacebookLoginButton
            text="Login with Facebook"
            iconSize="18px"
            style={{
              height: "40px",
              minWidth: "200px",
              maxWidth: "400px",
              fontSize: "14px",
              margin: "0",
            }}
          />
        </LoginSocialFacebook>
      </div>

      <p>
        New Customer? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
