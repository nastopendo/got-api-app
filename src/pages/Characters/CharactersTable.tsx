import { useState, useEffect } from "react";
import { fetchCharacters } from "../../services/ApiService";
import styles from "./CharactersTable.module.css";

export interface Character {
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

export const determineIfAlive = (character: Character) => {
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

    return `No, died at ${ageAtDeath} years old`;
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
  const [gender, setGender] = useState("Any");
  const [culture, setCulture] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchAndSetCharacters(currentPage, pageSize);
  }, [currentPage, pageSize, gender]);

  const fetchAndSetCharacters = async (page: number, pageSize: number) => {
    try {
      const { data, totalPages } = await fetchCharacters(
        page,
        pageSize,
        gender !== "Any" ? gender : "",
        culture
      );
      setCharacters(data);
      setTotalPages(totalPages);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch characters");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = () => {
    fetchAndSetCharacters(currentPage, pageSize);
  };

  if (loading) return <p>Loading characters...</p>;
  if (error) return <p>{error}</p>;
  if (characters.length === 0) return <p>No characters found.</p>;

  return (
    <div className={styles.charactersTable}>
      <div className={styles.filterContainer}>
        <select
          value={gender}
          onChange={(e) => {
            setGender(e.target.value);
          }}
        >
          <option value="Any">Any</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="text"
          value={culture}
          onChange={(e) => setCulture(e.target.value)}
          placeholder="Culture"
        />
        <button onClick={handleFilterChange}>Filter</button>
      </div>
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
      <div className={styles.pagination}>
        <div className={styles.paginationButtons}>
          <button onClick={() => handlePageChange(1)}>First page</button>
          <button onClick={() => handlePageChange(currentPage - 1)}>
            Previous page
          </button>
          <button onClick={() => handlePageChange(currentPage + 1)}>
            Next page
          </button>
          <button onClick={() => handlePageChange(totalPages)}>
            Last page
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <select
          value={pageSize.toString()}
          onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
          className={styles.paginationSelect}
        >
          <option value="10">10 / page</option>
          <option value="25">25 / page</option>
          <option value="50">50 / page</option>
        </select>
      </div>
    </div>
  );
};

export default CharactersTable;
