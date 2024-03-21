import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchHouse } from "../../services/ApiService";

const HouseDetails = () => {
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>{house?.name}</h2>
      <p>Region: {house?.region}</p>
      <p>Coat of Arms: {house?.coatOfArms}</p>
      <p>Words: {house?.words}</p>
      <p>Titles: {house?.titles.join(", ") || "None"}</p>
      <p>Seats: {house?.seats.join(", ") || "None"}</p>
      <p>Has Died Out: {house?.diedOut ? "Yes" : "No"}</p>
      <p>Has Overlord: {house?.overlord ? "Yes" : "No"}</p>
      <p>Number of Cadet Branches: {house?.cadetBranches.length}</p>
      <p>Sworn Members: {house?.swornMembers.length}</p>
    </div>
  );
};

export default HouseDetails;
