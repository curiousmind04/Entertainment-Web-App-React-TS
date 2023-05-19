import { useRef, useState, useContext } from "react";
import { MediaItem } from "myTypes";
import { AuthContext } from "../context/auth-context";
import { useNavigate } from "react-router-dom";

import classes from "./Styles.module.css";

type Props = {
  data: MediaItem[] | undefined;
  onMovieBookmark: (movie: MediaItem) => void;
  onTVBookmark: (series: MediaItem) => void;
  movieBookmarks: MediaItem[];
  tvBookmarks: MediaItem[];
};

const HomePage: React.FC<Props> = ({
  data,
  onMovieBookmark,
  onTVBookmark,
  movieBookmarks,
  tvBookmarks,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const trending = data?.filter(
    (item) => item.thumbnail.trending !== undefined
  );

  const searchHandler = () => {
    const currentInput = inputRef.current?.value
      .toLowerCase()
      .replace(/'/g, "");

    if (currentInput && currentInput !== "") {
      const results = data?.filter((item) => {
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

  const bookmarkHandler = (bookmark: MediaItem) => {
    if (!auth?.isLoggedIn) {
      navigate("/auth");
    } else if (bookmark.category === "Movie") {
      onMovieBookmark(bookmark);
    } else {
      onTVBookmark(bookmark);
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
          placeholder="Search for movies or TV series"
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
        <h2>{`Found ${searchResults.length} result(s) for '${inputRef.current?.value}'`}</h2>
        <div className={classes.container}>
          {searchResults.length > 0 &&
            searchResults.map((item) => (
              <div className={classes.regularItem} key={item.title}>
                <div className={classes.imageContainer}>
                  <div
                    className={classes.bookmark}
                    onClick={bookmarkHandler.bind(null, item)}
                  >
                    <img
                      src={`/assets/icon-bookmark-${
                        movieBookmarks.some(
                          (bookmark) => bookmark.title === item.title
                        ) ||
                        tvBookmarks.some(
                          (bookmark) => bookmark.title === item.title
                        )
                          ? "full"
                          : "empty"
                      }.svg`}
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
                  <h3>{item.title}</h3>
                </div>
              </div>
            ))}
        </div>
      </section>

      <section
        className={classes.trending}
        hidden={
          inputRef.current === null || inputRef.current?.value === ""
            ? false
            : true
        }
      >
        <h2>Trending</h2>
        <div className={classes.slider} tabIndex={0}>
          {trending &&
            trending.length > 0 &&
            trending.map((item) => (
              <div className={classes.trendingItem} key={item.title}>
                <img
                  className={classes.smallTrending}
                  src={item.thumbnail.trending?.small}
                  alt="media picture"
                />
                <img
                  className={classes.largeTrending}
                  src={item.thumbnail.trending?.large}
                  alt="media picture"
                />
                <div className={classes.play}>
                  <img src="/assets/icon-play.svg" alt="play icon" />
                  <span>Play</span>
                </div>
                <div
                  className={classes.bookmark}
                  onClick={bookmarkHandler.bind(null, item)}
                >
                  <img
                    src={`/assets/icon-bookmark-${
                      movieBookmarks.some(
                        (bookmark) => bookmark.title === item.title
                      ) ||
                      tvBookmarks.some(
                        (bookmark) => bookmark.title === item.title
                      )
                        ? "full"
                        : "empty"
                    }.svg`}
                    alt="bookmark icon"
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
                    <div className={classes.separateUse}></div>
                    <span className={classes.ratingUse}>{item.rating}</span>
                  </div>
                  <h3>{item.title}</h3>
                </div>
                <div className={classes.rating}>
                  <p>{item.rating}</p>
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
        <h2>Recommended for you</h2>
        <div className={classes.container}>
          {data &&
            data.map((item) => (
              <div className={classes.regularItem} key={item.title}>
                <div className={classes.imageContainer}>
                  <div
                    className={classes.bookmark}
                    onClick={bookmarkHandler.bind(null, item)}
                  >
                    <img
                      src={`/assets/icon-bookmark-${
                        movieBookmarks.some(
                          (bookmark) => bookmark.title === item.title
                        ) ||
                        tvBookmarks.some(
                          (bookmark) => bookmark.title === item.title
                        )
                          ? "full"
                          : "empty"
                      }.svg`}
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
                  <h3>{item.title}</h3>
                </div>
              </div>
            ))}
        </div>
      </section>
    </>
  );
};

export default HomePage;
