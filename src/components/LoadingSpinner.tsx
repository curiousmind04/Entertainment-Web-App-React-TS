import classes from "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
  return (
    <div className={classes.overlay}>
      <div className={classes.ring}></div>
    </div>
  );
};

export default LoadingSpinner;
