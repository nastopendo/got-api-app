const BASE_URL = "https://anapioficeandfire.com/api";

const fetchCharacters = async (
  page: number = 1,
  pageSize: number = 10,
  gender: string = "",
  culture: string = ""
) => {
  let url = `${BASE_URL}/characters?page=${page}&pageSize=${pageSize}`;
  if (gender) {
    url += `&gender=${gender}`;
  }
  if (culture) {
    url += `&culture=${culture}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch characters");
  }
  return response.json();
};

const fetchHouse = async (houseId: string) => {
  const response = await fetch(`${BASE_URL}/houses/${houseId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch house details");
  }
  return response.json();
};

export { fetchCharacters, fetchHouse };
