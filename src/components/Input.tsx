import React, { useEffect, useReducer } from "react";

import { validate } from "../util/validators";

import classes from "./Input.module.css";

enum UserActionType {
  CHANGE = "CHANGE",
  TOUCH = "TOUCH",
}

type UserAction =
  | {
      type: UserActionType.CHANGE;
      val: string;
      validators: validator[];
    }
  | {
      type: UserActionType.TOUCH;
    };

type State = { value: string; isTouched: boolean; isValid: boolean };

const inputReducer = (state: State, action: UserAction) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH": {
      return { ...state, isTouched: true };
    }
    default:
      return state;
  }
};

type validator = {
  type: string;
  val?: number;
};

type Props = {
  initialValue: string;
  initialValid: boolean;
  id: string;
  onInput?: (id: string, value: string, isValid: boolean) => void;
  type: string;
  validators: validator[];
  element: string;
  label: string;
  errorText: string;
  placeholder: string;
};

const Input: React.FC<Props> = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    if (onInput) {
      onInput(id, value, isValid);
    }
  }, [id, value, isValid, onInput]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: UserActionType.CHANGE,
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({ type: UserActionType.TOUCH });
  };

  const element = props.element === "input" && (
    <input
      id={props.id}
      type={props.type}
      onChange={changeHandler}
      onBlur={touchHandler}
      value={inputState.value}
      className={classes.input}
      placeholder={props.placeholder}
    />
  );

  return (
    <div>
      <label htmlFor={props.id} className="sr-only">
        {props.label}
      </label>
      {element}
      {!inputState.isValid && inputState.isTouched && (
        <p className={classes.errorText}>{props.errorText}</p>
      )}
    </div>
  );
};

export default Input;
