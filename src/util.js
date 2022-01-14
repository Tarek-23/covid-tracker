import numeral from "numeral";

export const sortTable = (data) => {
  let sortedData = [...data];
  return sortedData.sort((a, b) => {
    return a.cases > b.cases ? -1 : 1;
  });
};

export const prettyPrint = (num, abbreviation, delta) => {
  return numeral(num).format(
    (delta && "+") +
      "0,0" +
      (abbreviation && `${Math.abs(num) > 1000 ? "." : ""}0a`)
  );
};

export const prettyPercent = (num) => {
  return numeral(num).format("0.0%");
};

export const casesTypeColors = {
  cases: {
    hex: "#FB4443",
    lighter: "#F5AAA7",
    multiplier: 150,
  },

  active: {
    hex: "#E67300",
    lighter: "#EDBD8C",
    multiplier: 350,
  },

  recovered: {
    hex: "#7DD71D",
    lighter: "#C3E598",
    multiplier: 150,
  },

  deaths: {
    hex: "#CC1034",
    lighter: "#E395A1",
    multiplier: 1000,
  },

  vaccinations: {
    hex: "#009C9D",
    lighter: "#00D8D8",
    multiplier: 200000,
  },
};
