import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchHouse } from "../../services/ApiService";
import styles from "./HouseDetails.module.css";

const HouseDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [house, setHouse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getHouseDetails = async () => {
      setIsLoading(true);
      try {
        const data = await fetchHouse(id as string);
        setHouse(data);
      } catch (error) {
        setError("Failed to fetch house details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getHouseDetails();
  }, [id]);

  const goBack = () => navigate("/");

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <>
      <button className={styles.backButton} onClick={goBack}>
        ← Back to main page
      </button>
      <div className={styles.container}>
        <h2 className={styles.title}>{house?.name}</h2>
        <p className={styles.info}>Region: {house?.region}</p>
        <p className={styles.info}>Coat of Arms: {house?.coatOfArms}</p>
        <p className={styles.info}>Words: {house?.words}</p>
        <p className={styles.info}>
          Titles: {house?.titles.join(", ") || "None"}
        </p>
        <p className={styles.info}>
          Seats: {house?.seats.join(", ") || "None"}
        </p>
        <p className={styles.info}>
          Has Died Out: {house?.diedOut ? "Yes" : "No"}
        </p>
        <p className={styles.info}>
          Has Overlord: {house?.overlord ? "Yes" : "No"}
        </p>
        <p className={styles.info}>
          Number of Cadet Branches: {house?.cadetBranches.length}
        </p>
        <p className={styles.info}>
          Sworn Members: {house?.swornMembers.length}
        </p>
      </div>
    </>
  );
};

export default HouseDetails;
