"use client";
import { useEffect } from "react";
import "./index.scss";
import MovieCard from "../MovieCard";
import { useMovies } from "@/components/context"; // Pega do balão
import ClipLoader from "react-spinners/ClipLoader";

export default function MovieList() {
  // Pegamos os filmes, o carregamento e a função do nosso contexto
  const { movies, loading, searchMovies } = useMovies();

  useEffect(() => {
    // Quando abrir a página, busca os filmes iniciais
    searchMovies(""); 
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
          <ClipLoader color="#6046ff" size={50} />
      </div>
    )
  }

  return (
    <ul className="movie-list">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </ul>
  );
}