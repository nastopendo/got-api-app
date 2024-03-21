import { determineIfAlive, Character } from "./CharactersTable";

const characterUnknown: Character = {
  url: "",
  name: "Unknown Character",
  gender: "",
  culture: "",
  born: "",
  died: "",
  titles: [],
  aliases: [],
  father: "",
  mother: "",
  spouse: "",
  allegiances: [],
  books: [],
  povBooks: [],
  tvSeries: [],
  playedBy: [],
};

const characterAlive: Character = {
  ...characterUnknown,
  died: "",
  born: "In 303 BC",
};

const characterDead: Character = {
  ...characterUnknown,
  died: "In 3 AC",
  born: "In 33 BC",
};

const characterDied: Character = {
  ...characterUnknown,
  died: "In 303 AC",
};

const characterBorn: Character = {
  ...characterUnknown,
  born: "In 303 BC",
};

const characterBothAC: Character = {
  ...characterUnknown,
  born: "In 3 AC",
  died: "In 87 AC",
};

const characterBothBC: Character = {
  ...characterUnknown,
  born: "In 87 BC",
  died: "In 22 BC",
};

describe("CharactersTable", () => {
  describe("determineIfAlive function", () => {
    // - Display "Unknown” if both born and died are not provided.
    // - Display "No” if born is not provided.
    // - Display "No, died at X years old" when Character has died, where X is his age in years at the time
    // of death.
    // - Display "Yes" when Character has not died.

    it("should display 'Unknown' if both born and died are not provided", () => {
      const result = determineIfAlive(characterUnknown);
      expect(result).toBe("Unknown");
    });

    it("should display 'No' if born is not provided", () => {
      const result = determineIfAlive(characterDied);
      expect(result).toBe("No");
    });

    it("should display 'No, died at 36 years old' when Character has died, where X is his age in years at the time of death", () => {
      const result = determineIfAlive(characterDead);
      expect(result).toBe("No, died at 36 years old");
    });

    it("should display 'Yes' when Character has not died", () => {
      const result = determineIfAlive(characterAlive);
      expect(result).toBe("Yes");
    });

    it("should display 'Yes' when Character has not died 2", () => {
      const result = determineIfAlive(characterBorn);
      expect(result).toBe("Yes");
    });

    it("should display 'No, died at 84 years old' when Character has died, where X is his age in years at the time of death", () => {
      const result = determineIfAlive(characterBothAC);
      expect(result).toBe("No, died at 84 years old");
    });

    it("should display 'No, died at 65 years old' when Character has died, where X is his age in years at the time of death", () => {
      const result = determineIfAlive(characterBothBC);
      expect(result).toBe("No, died at 65 years old");
    });
  });
});
