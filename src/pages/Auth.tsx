import React, { useContext, useState } from "react";

import Input from "../components/Input";
import { AuthContext } from "../context/auth-context";
import { useForm } from "../hooks/form-hook";
import { useHttpClient } from "../hooks/http-hook";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from "../util/validators";

import LoadingSpinner from "../components/LoadingSpinner";
import classes from "./Auth.module.css";

const AuthPage = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { sendRequest, isLoading } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        { ...formState.inputs, passwordRepeat: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          passwordRepeat: { value: "", isValid: false },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_REACT_APP_BACKEND_URL + "/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth?.login(
          responseData.userId,
          responseData.token,
          responseData.movieBookmarks,
          responseData.tvBookmarks
        );
        auth?.movieBookmarksHandler(responseData.movieBookmarks);
        auth?.tvBookmarksHandler(responseData.tvBookmarks);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        if (
          formState.inputs.passwordRepeat?.value ===
          formState.inputs.password.value
        ) {
          const formData = new FormData();
          formData.append("email", formState.inputs.email.value);
          formData.append("password", formState.inputs.password.value);
          const responseData = await sendRequest(
            import.meta.env.VITE_REACT_APP_BACKEND_URL + "/users/signup",
            "POST",
            JSON.stringify(Object.fromEntries(formData)),
            {
              "Content-Type": "application/json",
            }
          );
          auth?.login(
            responseData.userId,
            responseData.token,
            responseData.movieBookmarks,
            responseData.tvBookmarks
          );
        } else {
          console.log("passwords don't match");
          alert("Error: Passwords do not match!");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className={classes.container}>
      <img src="/assets/logo.svg" alt="logo" />
      <div>
        {auth?.isLoggedIn && (
          <button className={classes.logout} onClick={auth?.logout}>
            LOGOUT
          </button>
        )}
      </div>
      {!auth?.isLoggedIn && (
        <div className={classes.demo}>
          <h2>Login Credentials for Demo Purposes:</h2>
          <p>Email: test@test.com</p>
          <p>Password: testers</p>
        </div>
      )}
      {isLoading && (
        <div className={classes.loading}>
          <div className="center">
            <LoadingSpinner />
          </div>
        </div>
      )}

      {!auth?.isLoggedIn && (
        <div className={classes.auth}>
          <h2>{isLoginMode ? "Login" : "Sign up"}</h2>
          <form onSubmit={authSubmitHandler}>
            <Input
              element="input"
              id="email"
              type="email"
              label="E-Mail"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email address."
              onInput={inputHandler}
              initialValid={false}
              initialValue=""
              placeholder="Email address"
            />
            <Input
              element="input"
              id="password"
              type="password"
              label="Password"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Please enter a valid password, at least 6 characters."
              onInput={inputHandler}
              initialValid={false}
              initialValue=""
              placeholder="Password"
            />
            {!isLoginMode && (
              <Input
                element="input"
                id="passwordRepeat"
                type="password"
                label="Password Repeat"
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText="Please repeat the password."
                onInput={inputHandler}
                initialValid={false}
                initialValue=""
                placeholder="Repeat Password"
              />
            )}
            <button
              type="submit"
              className={classes.submit}
              disabled={!formState.isValid}
            >
              {isLoginMode ? "Login to your account" : "Create an account"}
            </button>
          </form>
          <div className={classes.bottom}>
            <span>
              {isLoginMode
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>
            <button onClick={switchModeHandler}>
              {isLoginMode ? "Sign up" : "Login"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
