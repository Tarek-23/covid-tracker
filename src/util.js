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
