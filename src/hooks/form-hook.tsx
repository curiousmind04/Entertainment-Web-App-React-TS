import { useCallback, useReducer } from "react";

enum UserActionType {
  INPUT_CHANGE = "INPUT_CHANGE",
  SET_DATA = "SET_DATA",
}

type UserAction =
  | {
      type: UserActionType.INPUT_CHANGE;
      value: string;
      isValid: boolean;
      inputId: string;
    }
  | {
      type: UserActionType.SET_DATA;
      formIsValid: boolean;
      inputs: {
        email: { isValid: boolean; value: string };
        password: { isValid: boolean; value: string };
        passwordRepeat?: { isValid: boolean; value: string } | undefined;
      };
    };

type State = {
  inputs: {
    email: { isValid: boolean; value: string };
    password: { isValid: boolean; value: string };
    passwordRepeat?: { isValid: boolean; value: string };
  };
  isValid: boolean;
};

const formReducer = (
  state:
    | State
    | {
        inputs: {
          email: { isValid: boolean; value: string };
          password: { isValid: boolean; value: string };
        };
        isValid: boolean;
      },
  action: UserAction
) => {
  switch (action.type) {
    case UserActionType.INPUT_CHANGE: {
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId as keyof typeof state.inputs]) {
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid =
            formIsValid &&
            state.inputs[inputId as keyof typeof state.inputs].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    }
    case UserActionType.SET_DATA:
      return { inputs: action.inputs, isValid: action.formIsValid };
    default:
      return state;
  }
};

export const useForm = (
  initialInputs: {
    email: { value: string; isValid: boolean };
    password: { value: string; isValid: boolean };
  },
  initialFormValidity: boolean
): [
  State,
  (id: string, value: string, isValid: boolean) => void,
  (
    inputData: {
      email: { isValid: boolean; value: string };
      password: { isValid: boolean; value: string };
      passwordRepeat?: { isValid: boolean; value: string };
    },
    formValidity: boolean
  ) => void
] => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  const inputHandler = useCallback(
    (id: string, value: string, isValid: boolean) => {
      dispatch({
        type: UserActionType.INPUT_CHANGE,
        value: value,
        isValid: isValid,
        inputId: id,
      });
    },
    []
  );

  const setFormData = useCallback(
    (
      inputData: {
        email: { isValid: boolean; value: string };
        password: { isValid: boolean; value: string };
        passwordRepeat?: { isValid: boolean; value: string } | undefined;
      },
      formValidity: boolean
    ) => {
      dispatch({
        type: UserActionType.SET_DATA,
        inputs: inputData,
        formIsValid: formValidity,
      });
    },
    []
  );

  return [formState, inputHandler, setFormData];
};
