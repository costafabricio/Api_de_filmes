"use client"

import { createContext, useState, useContext, ReactNode } from "react";
import { MovieDetails } from "@/types/movie";
import axios from "axios";

interface MovieContextData {
    movies: MovieDetails[];
    loading: boolean;
    searchMovies: (query: string) => Promise<void>;
}

const MovieContext = createContext<MovieContextData | undefined>(undefined);

export function MovieProvider({ children }: { children: ReactNode }) {
    const [movies, setMovies] = useState<MovieDetails[]>([]);
    const [loading, setLoading] = useState(false);

    async function searchMovies(query: string) {
        setLoading(true);
        try {
            // Se query for vazia, usa discover, se não, usa search
            const endpoint = query 
                ? "https://api.themoviedb.org/3/search/movie" 
                : "https://api.themoviedb.org/3/discover/movie";

            const response = await axios.get(endpoint, {
                params: {
                    api_key: "6471a41c1771d64839fc8f8ddea58884",
                    language: "pt-BR",
                    query: query,
                },
            });
            setMovies(response.data.results);
        } catch (error) {
            console.error("Erro na busca:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <MovieContext.Provider value={{ movies, loading, searchMovies }}>
            {children}
        </MovieContext.Provider>
    );
}

// 3. Hook para usar nos componentes
export function useMovies() {
    const context = useContext(MovieContext);
    if (!context) {
        throw new Error("useMovies deve ser usado dentro de um MovieProvider");
    }
    return context;
}