import React, { useState, useEffect, useCallback, useRef } from "react";
import PokemonCard from "./PokemonCard";

interface PokemonListProps {
  typeFilter: string;
}

interface PokemonBasic {
  name: string;
  url: string;
}

const PokemonList: React.FC<PokemonListProps> = ({ typeFilter }) => {
  const [pokemon, setPokemon] = useState<PokemonBasic[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPokemonElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setOffset((prevOffset) => prevOffset + 20);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    setLoading(true);
    let url = `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`;
    if (debouncedSearchTerm) {
      url = `https://pokeapi.co/api/v2/pokemon/${debouncedSearchTerm.toLowerCase()}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (debouncedSearchTerm) {
          setPokemon([data]);
        } else {
          setPokemon((prevPokemon) => [...prevPokemon, ...data.results]);
          setHasMore(data.next !== null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching pokemon:", err);
        setLoading(false);
      });
  }, [offset, debouncedSearchTerm]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search Pokemon"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          margin: "16px 0",
          borderRadius: "4px",
          border: "1px solid #ddd",
        }}
      />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {pokemon.map((p, index) => (
          <div
            key={p.name}
            ref={index === pokemon.length - 1 ? lastPokemonElementRef : null}
          >
            <PokemonCard
              id={p.url ? p.url.split("/").slice(-2, -1)[0] : (p as any).id}
            />
          </div>
        ))}
      </div>
      {loading && <div>Loading...</div>}
    </div>
  );
};

export default PokemonList;
