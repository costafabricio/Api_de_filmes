"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Movie } from "@/types/movie";
import axios from "axios";

interface MoviesContextData {
  movies: Movie[];
  loading: boolean;
  searchMovies: (query: string) => void;
  loadMoreMovies: () => void;
  hasMore: boolean;
}

const MoviesContext = createContext<MoviesContextData>({} as MoviesContextData);

export const MoviesProvider = ({ children }: { children: ReactNode }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(""); // Guarda o termo de busca atual
  const [hasMore, setHasMore] = useState(true);

  const API_KEY = "6471a41c1771d64839fc8f8ddea58884";
  const BASE_URL = "https://api.themoviedb.org/3";

  // Função principal para buscar filmes (tanto inicial quanto busca)
  const fetchMovies = async (currentPage: number, searchPath: string, isNewSearch: boolean, searchQuery?: string) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.get(`${BASE_URL}${searchPath}`, {
        params: {
          api_key: API_KEY,
          language: "pt-BR",
          page: currentPage,
          query: searchQuery || query || undefined, // Só envia query se ela existir
        },
      });

      const newMovies = response.data.results;

      if (isNewSearch) {
        setMovies(newMovies); // Se for busca nova ou reset, substitui a lista
      } else {
        setMovies((prev) => [...prev, ...newMovies]); // Se for scroll, acumula
      }

      // Verifica se ainda há páginas para carregar
      setHasMore(currentPage < response.data.total_pages);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Carregamento Inicial
  useEffect(() => {
    fetchMovies(1, "/movie/popular", true);
  }, []);

  // 2. Função para a Barra de Pesquisa (Reset)
  const searchMovies = (searchQuery: string) => {

    setQuery(searchQuery);
    setPage(1); // Volta para a página 1

    const cleanQuery = searchQuery.trim(); // " " vira busca popular
    setQuery(cleanQuery);

    const path = cleanQuery ? "/search/movie" : "/movie/popular";

    fetchMovies(1, path, true, cleanQuery);
  };

  // 3. Função para o Scroll Infinito (Acumular)
  const loadMoreMovies = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      const path = query ? "/search/movie" : "/movie/popular";
      fetchMovies(nextPage, path, false, query);
    }
  };

  return (
    <MoviesContext.Provider value={{ movies, loading, searchMovies, loadMoreMovies, hasMore }}>
      {children}
    </MoviesContext.Provider>
  );
};

export const useMovies = () => useContext(MoviesContext);