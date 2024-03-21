const BASE_URL = "https://anapioficeandfire.com/api";

interface LinkHeaders {
  [key: string]: string | undefined;
}

const parseLinkHeader = (header: string | null): LinkHeaders => {
  const links: LinkHeaders = {};
  if (!header || header.length === 0) {
    return links;
  }

  const parts = header.split(",");
  parts.forEach((p) => {
    const section = p.split(";");
    const url = section[0].replace(/<(.*)>/, "$1").trim();
    const name = section[1].replace(/rel="(.*)"/, "$1").trim();
    links[name] = url;
  });

  return links;
};

const fetchCharacters = async (
  page: number = 1,
  pageSize: number = 25,
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
  const linkHeader = response.headers.get("Link");
  const links = parseLinkHeader(linkHeader);
  const lastPageUrl = links ? links["last"] : null;
  let totalPages = 1;
  if (lastPageUrl) {
    const match = lastPageUrl.match(/page=(\d+)/);
    totalPages = match ? parseInt(match[1], 10) : 1;
  }

  const data = await response.json();
  return { data, totalPages };
};

const fetchHouse = async (houseId: string) => {
  const response = await fetch(`${BASE_URL}/houses/${houseId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch house details");
  }
  return response.json();
};

export { fetchCharacters, fetchHouse };
