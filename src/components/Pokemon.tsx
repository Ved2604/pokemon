import React, { useState, useEffect } from "react";
import PokemonList from "./PokemonList";

interface PokemonType {
  name: string;
  url: string;
}

const Pokemon: React.FC = () => {
  const [types, setTypes] = useState<PokemonType[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/type")
      .then((res) => res.json())
      .then((data) => {
        setTypes(data.results);
      })
      .catch((err) => console.error("Error fetching types:", err));
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>
        Pokemon Explorer
      </h1>
      <div style={{ margin: "20px 0", textAlign: "center" }}>
        <label htmlFor="type-filter">Filter by Type: </label>
        <select
          id="type-filter"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        >
          <option value="">All Types</option>
          {types.map((type) => (
            <option key={type.name} value={type.name}>
              {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <PokemonList typeFilter={selectedType} />
    </div>
  );
};

export default Pokemon;
