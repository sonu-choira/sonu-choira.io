import React, { useLayoutEffect, useState } from "react";

import singer from "../../assets/img/singer2.png";
import "../home/signin.css";
import logo from "../../assets/img/logo-choira.svg";
import google from "../../assets/img/google.png";
import facebook from "../../assets/img/facebook.png";
import apple from "../../assets/img/apple.png";
import OptVerify from "../../components/signin/OptVerify";
import SigninNum from "../../components/signin/SigninNum";
import SignUpDetails from "../../components/signin/SignUpDetails";

import "./home.scss";

import { useNavigate } from "react-router";
import firebaseApp from "../../helper/firebaseInit";
import socialMediaAuth from "../../services/firebaseService";
import { googleProvider, facebookProvider } from "../../helper/firebaseMethod";
import axios from "axios";

import Swal from "sweetalert2";

// import SpotifyWebApi from "spotify-web-api-js"
import { loginUrl, getTokenByUrl } from "../../spotify";

import { httpUrl, nodeUrl } from "../../restservice";

let loginCheckVerify = true;

let isLogin = false;

let saveIntervalSpotify;
let storedata;

const dataForRegistration = {
  name: "",
  phone: "",
  email: "",
  login: {
    type: "CUSTOMER",
    email: "",
    password: "",
    signuptype: "EMAIL",
  },
  city: "",
  photo: {
    docname: "SSO",
    docdesc: "Customer profile photo",
    doctype: "PROFILE",
    urllink: "",
  },
};

const showError = (msg) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: msg,
    showConfirmButton: false,
    timer: 5500,
  });
};

const initFirebase = firebaseApp;

// console.log(btoa(JSON.stringify(initFirebase)))

const innertitle = {
  lineHeight: "85px",
  fontWeight: "600",
  borderBottom: "3.5px solid #ffc701",
  fontSize: "25px",
};

function Signin() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isComingOpen, setIsComingOpen] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [isScreenOpen, setIsScreenOpen] = useState(0);
  const [isWordData, setIsWordData] = useState("");
  const [isvisiblecontact, setcontactus] = useState(false);
  const [values, setInputField] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });

  const navigate = useNavigate();
  const [size, setSize] = useState([0, 0]);

  const inputsHandler = (name) => (e) => {
    setInputField({ ...values, [name]: e.target.value });
  };

  useLayoutEffect(() => {
    function updateSize() {
      if (window.innerWidth < 1124) {
        setIsMenuOpen(false);
      } else {
        setIsMenuOpen(true);
      }
      setSize([window.innerWidth, window.innerHeight]);
      // console.log(size)
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const checkLogin = () => {
    if (loginCheckVerify) {
      let loginState = localStorage.getItem("isLogin");
      if (loginState === "true") {
        isLogin = true;
      } else {
        isLogin = false;
      }
      loginCheckVerify = false;
    }
    dataForRegistration.phone = new Date().getTime();
  };

  checkLogin();

  const closeModel = () => {
    setIsLoginOpen(false);
    loginCheckVerify = true;
    checkLogin();
  };

  const gotoDashboard = () => {
    let getLocal = JSON.parse(localStorage.getItem("userData")).login.type;
    if (getLocal === "CUSTOMER") {
      navigate("/userHome");
    } else if (getLocal === "ARTIST_MANAGER") {
      navigate("/armHome");
    } else {
      navigate("/adminHome");
    }
  };
  const navigates = navigate;
  const gotoSignup = () => {
    navigates("/signup");
  };
  const sendmail = (e) => {
    e.preventDefault();

    const { firstname, lastname, email, phone } = values;
    let sendformat = {
      email: email,
      admin: "vivarta@choira.io",
      fName: firstname,
      lName: lastname,
      phone: phone,
    };

    console.log(values);

    if (values.phone.length !== 10) {
      Swal.fire({
        icon: "warning",
        title: "Please Enter Your 10 Digit Number",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      axios.post(nodeUrl + "contactUs", sendformat).then((responce) => {
        console.log(responce.data);
      });
      Swal.fire({
        icon: "success",
        title: "Your mail has been sent successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      setcontactus(false);
      values.firstname = "";
      values.lastname = "";
      values.phone = "";
      values.email = "";
    }
  };

  const loginUser = (getEmail) => {
    let sendableData = {
      email: getEmail,
      password: "",
    };
    axios
      .post(httpUrl + "login", sendableData)
      .then((result) => {
        let responseJson = result.data;
        localStorage.setItem("userData", JSON.stringify(result.data));
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("photo", JSON.stringify(result.data.photo));
        navigate("/userHome");
        console.log(responseJson);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Duplicate Account",
          text: "Your account is already created with Username and password.",
          showConfirmButton: false,
          timer: 5500,
        });
      });
  };

  const handleFirebaseClick = async (provider, ssType) => {
    const res = await socialMediaAuth(provider);
    console.log(res);

    if (res.accessToken) {
      let userEmail = res.email;
      axios.get(httpUrl + "login?email=" + userEmail).then((result) => {
        let responseJson = result.data;
        if (responseJson.error === "USERNAME_ALREADY_EXIST") {
          loginUser(userEmail);
        } else {
          dataForRegistration.name = res.displayName;
          dataForRegistration.email = res.email;
          dataForRegistration.login.email = res.email;
          dataForRegistration.login.signuptype = "SSO";
          dataForRegistration.login.ssotype = ssType;
          dataForRegistration.photo.urllink = res.photoURL;
          // setIsScreenOpen(2)
          registerUser({ city: "", phone: "" });
          sendwelcomemail(dataForRegistration.name, dataForRegistration.email);
        }
        console.log(responseJson);
      });
    } else {
      if (res.code === "auth/account-exists-with-different-credential") {
        showError(
          "You are register with different Provider. Please use the same"
        );
      }
      // else if (res.code === "auth/popup-closed-by-user") {
      //   showError("You closed the Connection")
      // }
      else {
        showError("Unable To connect");
      }
    }
  };

  const registerUser = (data) => {
    dataForRegistration.city = "Mumbai";
    axios
      .post(httpUrl + "customer", dataForRegistration)
      .then((result) => {
        let responseJson = result;
        localStorage.setItem("userData", JSON.stringify(result.data));
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("photo", JSON.stringify(result.data.photo));
        console.log(responseJson);

        navigate("/userHome");
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Duplicate Account",
          text: "Your account is already created with other SignOn Type.",
          showConfirmButton: false,
          timer: 5500,
        });
      });
  };

  const sendwelcomemail = (name, email) => {
    let sendformat = {
      email: email,
      name: name,
      username: name,
    };

    axios.post(nodeUrl + "welcomeMail", sendformat).then((responce) => {
      console.log(responce.data);
    });
  };

  const showComingSoon = () => {
    // function for other page to move in coming soon section.
    setIsExplorerOpen(true);
    // setIsComingOpen(true)
  };

  const proceedNext = () => {
    if (isLogin) {
      gotoDashboard();
    } else {
      setIsLoginOpen(true);
    }
  };

  const spotifyLogin = () => {
    let spotifyWindow = window.open(loginUrl, "_blank", "width=500,height=500");
    saveIntervalSpotify = setInterval(function () {
      try {
        let letToken = getTokenByUrl(spotifyWindow.window.location);
        console.log("letToken");
        console.log(letToken);
        storedata = letToken.access_token;
        clearExtra();
        spotifyWindow.close();
        getSpotifyapi();
      } catch (error) {
        console.log(error);
      }
    }, 2000);
  };

  const getSpotifyapi = () => {
    axios
      .get("https://api.spotify.com/v1/me", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedata}`,
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data) {
          let userEmail = res.data.email;
          axios.get(httpUrl + "login?email=" + userEmail).then((result) => {
            let responseJson = result.data;
            if (responseJson.error === "USERNAME_ALREADY_EXIST") {
              loginUser(userEmail);
            } else {
              dataForRegistration.name = res.data.display_name;
              dataForRegistration.email = res.data.email;
              dataForRegistration.login.email = res.data.email;
              dataForRegistration.login.signuptype = "SSO";
              dataForRegistration.login.ssotype = "SPOTIFY";
              if (res.data.images[0]) {
                dataForRegistration.photo.urllink = res.data.images[0].url;
              }
              registerUser({ city: "", phone: "" });
              sendwelcomemail(
                dataForRegistration.name,
                dataForRegistration.email
              );
            }
            console.log(responseJson);
          });
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Not Allowed",
          text: error,
          showConfirmButton: false,
          timer: 5500,
        });
      });
  };

  const clearExtra = () => {
    clearInterval(saveIntervalSpotify);
  };

  const connectedUsBox = (event) => {
    setIsWordData(event.target.value);
  };

  const connectedUs = (event) => {
    event.preventDefault();

    let sendAbleData = {
      email: isWordData,
      admin: "vivarta@choira.io",
    };

    axios.post(nodeUrl + "contactUs", sendAbleData).then((responce) => {
      console.log(responce.data);
      Swal.fire({
        icon: "success",
        title: "Request received successfully!",
        text: "We will connect you ASAP.",
        showConfirmButton: false,
        timer: 5500,
      });
    });
  };

  const signin = true;

  const [mobileNumber, setMobileNumber] = useState("");

  // State to manage the sign-in steps
  const [sign, setSign] = useState(1);

  // Function to handle mobile number input
  const handleMobileNumberChange = (e) => {
    setMobileNumber(e.target.value);
  };

  const handleContinueButtonClick = () => {
    // Check if the mobile number is not empty and has exactly 10 digits
    const trimmedMobileNumber = mobileNumber.trim();
    if (trimmedMobileNumber !== "" && trimmedMobileNumber.length === 10) {
      setSign(2);
      // Perform any other actions as needed
    } else {
      // Display an error message or take appropriate action
      alert("Please enter a valid 10-digit mobile number.");
    }
  };
  const [countryCode, setCountryCode] = useState("91");
  const handleCountryCodeChange = (code) => {
    setCountryCode(code);
  };
  let [checkOtp, setCheckOtp] = useState(true);
  const check_otp_btn = () => {
    setCheckOtp(false);
  };
  const gotoHome = () => {
    navigate("/home");
  };

  return (
    <>
      <div className="navbar">
        <img
          src={logo}
          alt="Choira Logo"
          style={{ cursor: "pointer" }}
          onClick={gotoHome}
        />
      </div>

      <div className="wrapper">
        <form>
          <div className="main">
            <div className="singer">
              <img src={singer} alt="Singer" />
            </div>

            <div className="signup">
              <div className="signup-main">
                <div className="signup-main-2">
                  <div className="signup-header">
                    <div>
                      <h3>
                        Welcome to <span>Choira</span>
                      </h3>
                    </div>
                    <div>
                      <div>
                        <h5>
                          {`${signin ? "No Account ?" : "Have an Account ?"}`}
                          <br />{" "}
                          <h3 onClick={gotoSignup}>{`${
                            signin ? "Signup" : "Signin"
                          }`}</h3>
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="signup-header2">
                    <h1>{`${signin ? "Sign in" : "Sign Up"}`} </h1>
                  </div>
                  <div className="enter-mob">
                    {sign == 1 ? (
                      <SigninNum
                        mobileNumber={mobileNumber}
                        handleMobileNumberChange={handleMobileNumberChange}
                        countryCode={countryCode} // Pass the country code to SigninNum
                        onCountryCodeChange={handleCountryCodeChange} // Pass the handler function
                      />
                    ) : sign == 2 ? (
                      <OptVerify
                        mobileNumber={mobileNumber}
                        countryCode={countryCode}
                        checkOtp={checkOtp}
                        setCheckOtp={setCheckOtp}
                      />
                    ) : (
                      <SignUpDetails />
                    )}

                    <div className="footer">
                      <div
                        className={`${
                          sign == 1
                            ? "hr-line"
                            : sign == 2
                            ? "visiblity"
                            : "visiblity"
                        }`}
                      >
                        <div></div>
                        <small>OR</small>
                        <div></div>
                      </div>

                      <div
                        className={`${
                          sign == 1
                            ? "signin-option"
                            : sign == 2
                            ? "visiblity"
                            : "visiblity"
                        }`}
                      >
                        <div
                          onClick={() =>
                            handleFirebaseClick(googleProvider, "GOOGLE")
                          }
                        >
                          <img src={google} alt="Google" />
                          <small>Sign in with Google </small>
                        </div>
                        <div
                          onClick={() =>
                            handleFirebaseClick(facebookProvider, "FACEBOOK")
                          }
                        >
                          <img src={facebook} alt="Facebook" />
                        </div>
                        <div>
                          <img src={apple} alt="Apple" />
                        </div>
                      </div>
                      <div
                        className={`${
                          sign == 1
                            ? "continue"
                            : sign == 2
                            ? "verify-continue2 continue "
                            : " continue "
                        }`}
                      >
                        <div>
                          {sign === 2 && signin ? (
                            <button type="button" onClick={check_otp_btn}>
                              submit
                            </button>
                          ) : (
                            <button
                              type="submit"
                              onClick={handleContinueButtonClick}
                            >
                              continue
                            </button>
                          )}
                        </div>
                        <div>
                          <h6>
                            By creating an account or logging in, you agree to
                            Choira's <br /> <span>Conditions of Use</span> and
                            <span>Privacy Policy.</span>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Signin;
