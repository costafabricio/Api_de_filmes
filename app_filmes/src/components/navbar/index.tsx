"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useMovies } from "@/context";
import { BsSearch } from "react-icons/bs";
import "./index.scss";

export default function Navbar() {
  const [input, setInput] = useState("");
  const { searchMovies } = useMovies();

  function onResearch(e: FormEvent) {
    e.preventDefault();
    searchMovies(input);
  }

  function handleLogoClick() {
    setInput("");
    searchMovies("");
  }

  return (
    <nav className="navbar">

      <Link href="/" className="logo-link">
         <h1
          className="page-title"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
         >
         Filmes
       </h1>
     </Link>

      <div className="container-form">
        <form onSubmit={onResearch} className="form">
          <input
            type="text"
            placeholder="Pesquisar"
            className="research"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="button">
            <BsSearch size={20} color="#fff" />
          </button>
        </form>
      </div>
    </nav>
  );
}
