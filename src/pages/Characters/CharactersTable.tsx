import { useState, useEffect } from "react";
import { fetchCharacters } from "../../services/ApiService";
import styles from "./CharactersTable.module.css";

interface Character {
  url: string;
  name: string;
  gender: string;
  culture: string;
  born: string;
  died: string;
  titles: string[];
  aliases: string[];
  father: string;
  mother: string;
  spouse: string;
  allegiances: string[];
  books: string[];
  povBooks: string[];
  tvSeries: string[];
  playedBy: string[];
}

const extractYear = (dateStr: string): number | undefined => {
  const match = dateStr.match(/\b(\d+)\s*(AC|BC)\b/);
  if (match) {
    let year = parseInt(match[1]);
    const era = match[2];
    if (era === "BC") {
      year = -year;
    }
    return year;
  }
  return undefined;
};

const determineIfAlive = (character: Character) => {
  const { born, died } = character;
  if (!born && !died) {
    return "Unknown";
  }
  if (!born) {
    return "No";
  }
  if (died) {
    const bornYear = extractYear(born);
    const diedYear = extractYear(died);

    if (bornYear === undefined || diedYear === undefined) {
      return "Unknown";
    }

    const ageAtDeath = diedYear - bornYear;

    return `No, died at ${ageAtDeath} years old"`;
  }
  return "Yes";
};

const renderAllegiances = (allegiances: string[]) => {
  if (allegiances.length === 0) {
    return "No allegiances";
  }
  return allegiances.map((houseUrl, index) => {
    const houseId = houseUrl.split("/").pop();
    return (
      <div key={index}>
        <a href={`/house/${houseId}`}>House {houseId}</a>
      </div>
    );
  });
};

const CharactersTable = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchCharacters(5, 50);
        setCharacters(data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch characters");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) return <p>Loading characters...</p>;
  if (error) return <p>{error}</p>;
  if (characters.length === 0) return <p>No characters found.</p>;

  return (
    <div className={styles.charactersTable}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tableRow}>
            <th className={styles.tableCell}>Character</th>
            <th className={styles.tableCell}>Alive</th>
            <th className={styles.tableCell}>Gender</th>
            <th className={styles.tableCell}>Culture</th>
            <th className={styles.tableCell}>Allegiances</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {characters.map((character, index) => (
            <tr key={index} className={styles.tableRow}>
              <td className={styles.tableCell}>
                {" "}
                {[character.name, ...character.aliases]
                  .filter(Boolean)
                  .join(", ")}
              </td>
              <td className={styles.tableCell}>
                {determineIfAlive(character)}
              </td>
              <td className={styles.tableCell}>{character.gender}</td>
              <td className={styles.tableCell}>
                {character.culture || "Unknown"}
              </td>
              <td className={styles.tableCell}>
                {renderAllegiances(character.allegiances)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CharactersTable;
