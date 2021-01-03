import numeral from "numeral";

export const sortTable = (data) => {
  let sortedData = [...data];
  return sortedData.sort((a, b) => {
    return a.cases > b.cases ? -1 : 1;
  });
};

export const prettyPrint = (num, abbreviation) => {
  return num < 1000
    ? num
    : numeral(num).format("0,0" + (abbreviation && ".0a"));
};

export const casesTypeColors = {
  cases: {
    hex: "#FB4443",
    lighter: "#F5AAA7",
    multiplier: 300,
  },

  active: {
    hex: "#E67300",
    lighter: "#EDBD8C",
    multiplier: 350,
  },

  recovered: {
    hex: "#7DD71D",
    lighter: "#C3E598",
    multiplier: 350,
  },

  deaths: {
    hex: "#CC1034",
    lighter: "#E395A1",
    multiplier: 1000,
  },
};
