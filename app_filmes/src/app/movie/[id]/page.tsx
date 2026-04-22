"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import "./index.scss";

export default function MovieDetails() {
    const params = useParams();
    const [movie, setMovie] = useState<any>(null);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!params?.id) return;

        // Buscamos os detalhes E os vídeos em uma única chamada usando append_to_response
        axios.get(`https://api.themoviedb.org/3/movie/${params.id}`, {
            params: {
                api_key: "6471a41c1771d64839fc8f8ddea58884",
                language: "pt-BR",
                append_to_response: "videos"
            }
        }).then(response => {
            setMovie(response.data);
            
            // Procura um vídeo que seja do tipo 'Trailer' no YouTube
            const videos = response.data.videos.results;
            const trailer = videos.find((v: any) => v.type === "Trailer" && v.site === "YouTube") 
              || videos[0]; // Se não achar 'Trailer', pega o primeiro vídeo disponível

            if (trailer) {
                setTrailerKey(trailer.key);
            }
        }).catch(err => console.error("Erro ao carregar filme:", err));
    }, [params?.id]);

    if (!movie) return <div className="loading">Carregando...</div>;

    const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

    return (
        <div className="movie-details-page">
            {/* Banner de Fundo */}
            <div 
                className="backdrop" 
                style={{ backgroundImage: `url(${backdropUrl})` }}
            >
                <div className="overlay"></div>
            </div>

            <div className="container">
                <div className="poster-area">
                    <img 
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                        alt={movie.title} 
                    />
                </div>

                <div className="info-area">
                    <h1>{movie.title}</h1>
                    
                    <div className="meta-data">
                        <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
                        <span>{movie.release_date?.split("-")[0]}</span>
                        <span>{movie.runtime} min</span>
                    </div>

                    <div className="genres">
                        {movie.genres?.map((genre: any) => (
                            <span key={genre.id} className="genre-tag">{genre.name}</span>
                        ))}
                    </div>

                    <p className="overview">{movie.overview || "Sinopse não disponível em português."}</p>

                    <div className="actions">
                        
                        <button 
                            className="btn-trailer" 
                            onClick={() => setShowModal(true)}
                            disabled={!trailerKey}
                        >
                            {trailerKey ? "Assistir Trailer" : "Trailer Indisponível"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal do YouTube */}
            {showModal && trailerKey && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setShowModal(false)}>fechar ✕</button>
                        <iframe
                            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
}