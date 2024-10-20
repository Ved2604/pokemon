import React, { useState, useEffect } from "react";

interface PokemonCardProps {
  id: string;
}

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
  stats: {
    [key: string]: number;
  };
  sprite: string;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ id }) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${id}/`
        );
        if (!response.ok) {
          throw new Error("Pokemon not found");
        }
        const data = await response.json();
        setPokemon({
          id: data.id,
          name: data.name,
          height: data.height,
          weight: data.weight,
          types: data.types.map((type: any) => type.type.name),
          abilities: data.abilities.map((ability: any) => ability.ability.name),
          stats: data.stats.reduce((acc: any, stat: any) => {
            acc[stat.stat.name] = stat.base_stat;
            return acc;
          }, {}),
          sprite: data.sprites.front_default,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!pokemon) return null;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        margin: "8px",
        width: "200px",
        textAlign: "center",
      }}
    >
      <img
        src={pokemon.sprite}
        alt={pokemon.name}
        style={{ width: "96px", height: "96px" }}
      />
      <h2 style={{ margin: "8px 0" }}>{pokemon.name}</h2>
      <p>Type: {pokemon.types.join(", ")}</p>
      <p>Height: {pokemon.height}</p>
      <p>Weight: {pokemon.weight}</p>
    </div>
  );
};

export default PokemonCard;
