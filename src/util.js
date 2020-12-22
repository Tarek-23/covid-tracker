export const sortTable = (data) => {
  let sortedData = [...data];
  return sortedData.sort((a, b) => {
    return a.cases > b.cases ? -1 : 1;
  });
};
