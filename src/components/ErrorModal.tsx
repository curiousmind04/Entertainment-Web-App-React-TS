import classes from "./ErrorModal.module.css";

type Props = {
  error: string | null;
  match: string | null | undefined;
  onClear: () => void;
  onClearMatch: undefined | (() => void);
};

const ErrorModal: React.FC<Props> = ({
  error,
  onClear,
  match,
  onClearMatch,
}) => {
  return (
    <>
      {error && <div className={classes.backdrop} onClick={onClear}></div>}
      {match && <div className={classes.backdrop} onClick={onClearMatch}></div>}
      <div className={classes.container}>
        <h2>An Error Occurred!</h2>
        {error && <p>{error}</p>}
        {match && <p>{match}</p>}
        {error && <button onClick={onClear}>Okay</button>}
        {match && <button onClick={onClearMatch}>Okay</button>}
      </div>
    </>
  );
};

export default ErrorModal;
