import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const KEY = `6c3ffa69`;
const title = `power`;
// `http://www.omdbapi.com/?s=${povwe}&apikey=${6c3ffa69}`

const average = (array) =>
  array.reduce((cur, prev, i, array) => (cur + prev) / array.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query, resetSelectedId);
  // const [watched, setWatched] = useState([]);

  const [watched, setWatched] = useLocalStorageState([], "watched");
  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function resetSelectedId() {
    setSelectedId(null);
  }

  function handleAddWatchedMovie(mov) {
    setWatched((watched) => [...watched, mov]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movies]));
  }

  function handleDelete(id) {
    setWatched((watched) => watched.filter((mov) => mov.imdbID !== id));
  }

  return (
    <div className="app">
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {query.length < 3 ? (
            ""
          ) : error ? (
            <DisplayError error={error} />
          ) : (
            <>
              {isLoading ? (
                <Loading />
              ) : (
                <MoviesList
                  movies={movies}
                  onSelectedId={handleSelectMovie}
                  onDelete={handleDelete}
                />
              )}
            </>
          )}
        </Box>
        <Box>
          <>
            {selectedId ? (
              <>
                <MoviesDetails
                  selectedId={selectedId}
                  onReset={resetSelectedId}
                  onAddWatched={handleAddWatchedMovie}
                  watched={watched}
                />
              </>
            ) : (
              <>
                <Summary watched={watched} />
                <WatchedMovieList watched={watched} onDelete={handleDelete} />
              </>
            )}
          </>
        </Box>
      </Main>
    </div>
  );
}

function NavBar({ children }) {
  return <nav className="navigation">{children}</nav>;
}

function DisplayError({ error }) {
  return (
    <p className="message">
      <span>⛔️</span>
      {error}
    </p>
  );
}

function Loading() {
  return <p className="message">Loading....</p>;
}

function Logo() {
  return (
    <div className="logo">
      <h1>DateCorn</h1>
      <span role="img">🍿</span>
    </div>
  );
}
function Search({ query, setQuery }) {
  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputEl.current) return;

        if (e.code === "Enter") {
          inputEl.current.focus();
          setQuery("");
        }
      }
      document.addEventListener("keydown", callback);

      return () => document.removeEventListener("keydown", callback);
    },
    [setQuery],
  );

  // useEffect(function () {
  //   const el = document.querySelector(".search-input");
  //   el.focus();
  // }, []);

  const inputEl = useRef(null);

  return (
    <input
      type="text"
      className="search-input"
      placeholder="Search your movie..."
      value={query}
      ref={inputEl}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
function NumResult({ movies }) {
  return (
    <p className="search-result">
      Found<strong> {movies.length} </strong>results
    </p>
  );
}

function Main({ children }) {
  return <div className="movies-container">{children}</div>;
}

// left side
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  function handleOpen() {
    setIsOpen(!isOpen);
  }
  return (
    <div className="movies-search-box">
      <Button onClick={handleOpen}>
        <span className="btn-showList">{isOpen ? "-" : "+"}</span>
      </Button>
      <ul>{isOpen && children}</ul>
    </div>
  );
}

function MoviesList({ movies, onSelectedId }) {
  return (
    <ul>
      {movies.map((movie) => (
        <MoviesSearchLis
          movie={movie}
          key={movie.imdbID}
          onSelectedId={onSelectedId}
        />
      ))}
    </ul>
  );
}

function MoviesSearchLis({ movie, onSelectedId }) {
  return (
    <li className="movie" onClick={() => onSelectedId(movie.imdbID)}>
      <img src={movie.Poster} alt={`Poster of the ${movie} movie`} />
      <div>
        <h3>{movie.Title}</h3>
        <p>
          <span>🗓️</span> {movie.Year}
        </p>
      </div>
    </li>
  );
}

function Summary({ watched }) {
  const avgImdbRating = average(watched.map((mov) => mov.imdbRating));
  const avgUserRating = average(watched.map((mov) => mov.userRating));
  const avgRuntime = average(watched.map((mov) => mov.runtime));
  return (
    <li className="watched-movies">
      <h3>Movies you watched</h3>
      <div>
        <p>
          <span>#️⃣</span> <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span> <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span> <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⌛️</span> <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </li>
  );
}

function WatchedMovieList({ watched, onDelete }) {
  return (
    <ul>
      {watched.map((mov) => (
        <WatchedMovies mov={mov} key={mov.imdbID} onDelete={onDelete} />
      ))}
    </ul>
  );
}
function WatchedMovies({ mov, onDelete }) {
  return (
    <li className="movie">
      <img src={mov.poster} alt={mov.Title} />
      <div>
        <h3>{mov.title}</h3>
        <p className="userRating">
          <span>⭐️ {mov.imdbRating}</span>
          <span>🌟 {mov.userRating}</span>
          <span> {mov.runtime} min</span>
        </p>
      </div>
      <button className="btn-delete" onClick={() => onDelete(mov.imdbID)}>
        <span>x</span>
      </button>
    </li>
  );
}

function MoviesDetails({ selectedId, onReset, onAddWatched, watched }) {
  const [movie, setMovie] = useState("");
  const [isLoading, SetIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const isWatched = watched.map((mov) => mov.imdbID).includes(selectedId);
  const watchedUserRating = watched?.find((mov) => mov.imdbID === selectedId);

  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current++;
      console.log(countRef.current);
    },
    [userRating],
  );

  const {
    Poster: poster,
    Title: title,
    Released: released,
    Genre: genre,
    Actors: actors,
    Year: year,
    Plot: plot,
    Director: director,
    Runtime: runtime,
    imdbRating: imdbRating,
    userRating: rating,
    // countRatingDecision = countRef.current,
  } = movie;

  // if (imdbRating > 9) [isTop, setIsTop] = useState(true);

  // const isTop = imdbRating > 8;
  // console.log(isTop);

  // const [avgRating, setAvgRating] = useState(0);
  useKey("Escape", onReset);

  useEffect(
    function () {
      async function fetchMovie() {
        SetIsLoading(true);
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?i=${selectedId}&apikey=${KEY}`,
          );
          if (!res.ok) throw new Error("Something wrong with fetching movie");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovie(data);
        } catch (error) {
          console.error(error.message);
        } finally {
          SetIsLoading(false);
        }
      }
      fetchMovie();
    },
    [selectedId],
  );
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "Dope-date";
      };
    },
    [title],
  );

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    onAddWatched(newWatchedMovie);
    onReset();

    // setAvgRating(Number(imdbRating));
    // setAvgRating((avgRating) => (avgRating + userRating) / 2);
    // console.log(avgRating);
  }

  return (
    <div key={movie.imdbID}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onReset}>
              &larr;
            </button>
            <div className="selected-movie">
              <img src={poster} alt={movie.imdbID} />
              <div>
                <h3>{title}</h3>
                <span>
                  {released} &bull; {runtime}
                </span>
                <span> {genre}</span>
                <span>⭐️ {imdbRating} IMDb rating</span>
              </div>
            </div>
          </header>
          {/* <p>{avgRating}</p> */}
          <section className="movie-section">
            <div className="rating">
              {isWatched ? (
                <p>
                  You Rated this movie{" "}
                  <span>{watchedUserRating.userRating} 🌟 </span>
                </p>
              ) : (
                <StarRating
                  maxRating={10}
                  size="25"
                  onSetRating={setUserRating}
                />
              )}

              {userRating > 0 && (
                <button className="btn-add" onClick={handleAdd}>
                  + Add to list
                </button>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}
