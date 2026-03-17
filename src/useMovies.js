import { useState, useEffect } from "react";

const KEY = `6c3ffa69`;
export function useMovies(query) {
  const [isLoading, SetIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [error, SetError] = useState("");

  useEffect(
    function () {
      //   callback?.();

      const controller = new AbortController();
      async function fetchMovies() {
        try {
          SetIsLoading(true);
          SetError("");
          const res = await fetch(
            `http://www.omdbapi.com/?s=${query}&apikey=${KEY}`,
            { signal: controller.signal },
          );
          if (!res.ok)
            throw new Error(`Something when wrong with fetching movies!`);
          const data = await res.json();
          if (data.Response === "False") throw new Error(`Movie not found`);
          setMovies(data.Search);
          SetError("");
        } catch (error) {
          if (error.name !== "AbortError") {
            SetError(error.message);
          }
        } finally {
          SetIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        SetError("");
        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query],
  );
  return { movies, isLoading, error };
}
