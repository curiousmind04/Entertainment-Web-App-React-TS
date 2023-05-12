import { useRef, useState } from "react";
import { MediaItem } from "myTypes";

import classes from "./Styles.module.css";

type Props = {
  data: MediaItem[] | undefined;
};

const MoviesPage: React.FC<Props> = ({ data }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);

  const movies = data?.filter((item) => item.category === "Movie");

  const searchHandler = () => {
    const currentInput = inputRef.current?.value
      .toLowerCase()
      .replace(/'/g, "");

    if (currentInput && currentInput !== "") {
      const results = movies?.filter((item) => {
        //the apostrophe in the line below is different from a regular one,
        // had to copy/paste it from data.json file
        const match = item.title.toLowerCase().replace(/’/g, "");
        return match.includes(currentInput);
      });
      setSearchResults(results ? results : []);
    } else {
      setSearchResults([]);
    }
  };

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
          placeholder="Search for movies"
          ref={inputRef}
          onChange={searchHandler}
        />
        <div className={classes.underline}></div>
      </div>

      <section
        className={classes.searchResults}
        hidden={
          inputRef.current === null || inputRef.current?.value === ""
            ? true
            : false
        }
      >
        <h1>{`Found ${searchResults.length} result(s) for '${inputRef.current?.value}'`}</h1>
        <div className={classes.container}>
          {searchResults.length > 0 &&
            searchResults.map((item) => (
              <div className={classes.regularItem} key={item.title}>
                <div className={classes.imageContainer}>
                  <div className={classes.bookmark}>
                    <img
                      src="/assets/icon-bookmark-empty.svg"
                      alt="bookmark icon"
                    />
                  </div>
                  <div className={classes.play}>
                    <img src="/assets/icon-play.svg" alt="play icon" />
                    <span>Play</span>
                  </div>
                  <img
                    className={classes.smallMedia}
                    src={item.thumbnail.regular.small}
                    alt="media picture"
                  />
                  <img
                    className={classes.mediumMedia}
                    src={item.thumbnail.regular.medium}
                    alt="media picture"
                  />
                  <img
                    className={classes.largeMedia}
                    src={item.thumbnail.regular.large}
                    alt="media picture"
                  />
                </div>
                <div className={classes.info}>
                  <div className={classes.top}>
                    <span className={classes.year}>{item.year}</span>
                    <div className={classes.separate}></div>
                    <div className={classes.category}>
                      <img
                        src={`/assets/icon-category-${
                          item.category === "Movie" ? "movie" : "tv"
                        }.svg`}
                        alt="category icon"
                      />
                      <span>{item.category}</span>
                    </div>
                    <div className={classes.separate}></div>
                    <span>{item.rating}</span>
                  </div>
                  <h2>{item.title}</h2>
                </div>
              </div>
            ))}
        </div>
      </section>

      <section
        className={classes.list}
        hidden={
          inputRef.current === null || inputRef.current?.value === ""
            ? false
            : true
        }
      >
        <h1>Movies</h1>
        <div className={classes.container}>
          {movies &&
            movies.map((item) => (
              <div className={classes.regularItem} key={item.title}>
                <div className={classes.imageContainer}>
                  <div className={classes.bookmark}>
                    <img
                      src="/assets/icon-bookmark-empty.svg"
                      alt="bookmark icon"
                    />
                  </div>
                  <div className={classes.play}>
                    <img src="/assets/icon-play.svg" alt="play icon" />
                    <span>Play</span>
                  </div>
                  <img
                    className={classes.smallMedia}
                    src={item.thumbnail.regular.small}
                    alt="media picture"
                  />
                  <img
                    className={classes.mediumMedia}
                    src={item.thumbnail.regular.medium}
                    alt="media picture"
                  />
                  <img
                    className={classes.largeMedia}
                    src={item.thumbnail.regular.large}
                    alt="media picture"
                  />
                </div>
                <div className={classes.info}>
                  <div className={classes.top}>
                    <span className={classes.year}>{item.year}</span>
                    <div className={classes.separate}></div>
                    <div className={classes.category}>
                      <img
                        src={`/assets/icon-category-${
                          item.category === "Movie" ? "movie" : "tv"
                        }.svg`}
                        alt="category icon"
                      />
                      <span>{item.category}</span>
                    </div>
                    <div className={classes.separate}></div>
                    <span>{item.rating}</span>
                  </div>
                  <h2>{item.title}</h2>
                </div>
              </div>
            ))}
        </div>
      </section>
    </>
  );
};

export default MoviesPage;
