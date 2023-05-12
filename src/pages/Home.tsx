import classes from "./Home.module.css";

const HomePage = () => {
  return (
    <>
      <div className={classes.search}>
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <img src="/assets/icon-search.svg" alt="search icon" />
        <input
          type="text"
          id="search"
          name="search"
          placeholder="Search for movies or TV series"
        />
        <div className={classes.underline}></div>
      </div>
      <section className={classes.trending}>
        <h1>Trending</h1>
        <div className={classes.slider}></div>
      </section>
    </>
  );
};

export default HomePage;
