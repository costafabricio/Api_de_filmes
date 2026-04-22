"use client";
import { useEffect } from "react";
import "./index.scss";
import MovieCard from "../MovieCard";
import { useMovies } from "@/context"; 
import ClipLoader from "react-spinners/ClipLoader";

export default function MovieList() {
  // Pegamos tudo que o Context oferece agora
  const { movies, loading, searchMovies, loadMoreMovies, hasMore } = useMovies();


  // 2. Lógica do Scroll Infinito
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      // Verifica se o usuário chegou a 300px do fim da página
      const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

      if (isBottom) {
        loadMoreMovies();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, loadMoreMovies]);

  // Se for a PRIMEIRA carga e não tiver filmes, mostra o loading centralizado
  if (loading && movies.length === 0) {
    return (
      <div className="loading-container">
        <ClipLoader color="#6046ff" size={50} />
      </div>
    );
  }

  return (
    <div className="home-wrapper">
      <ul className="movie-list">
        {movies.map((movie, index) => (
          // Usamos index junto com ID para garantir chaves únicas no scroll
          <MovieCard key={`${movie.id}-${index}`} movie={movie} />
        ))}
      </ul>

      {/* Loader de Rodapé: Aparece só quando estamos buscando mais páginas */}
      {loading && (
        <div className="loading-more">
          <ClipLoader color="#6046ff" size={35} />
          <p>Carregando mais...</p>
        </div>
      )}

      {/* Mensagem de fim de catálogo */}
      {!hasMore && movies.length > 0 && (
        <p className="end-of-list">Você chegou ao fim do catálogo! 🎬</p>
      )}
    </div>
  );
}