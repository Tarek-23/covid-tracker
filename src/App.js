import "./css/App.css";
import { useState, useEffect } from "react";
import {
  Card,
  FormControl,
  Select,
  MenuItem,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./components/InfoBox";
import Table from "./components/Table";
import { sortTable } from "./util";

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("worldwide");
  const [countryData, setCountryData] = useState({});
  const [tableData, setTableData] = useState([]);

  const api_url = "https://www.disease.sh/v3/covid-19/";

  useEffect(() => {
    const getCountryInfo = async () => {
      await fetch(api_url + "countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          setCountries(countries);
          setTableData(sortTable(data));
        });
    };

    getCountryInfo();
    // setSelectedCountry("worldwide");
  }, []);

  useEffect(() => {
    const url =
      selectedCountry === "worldwide"
        ? api_url + "all"
        : api_url + `countries/${selectedCountry}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountryData(data);
      });
  }, [selectedCountry]);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h2>COVID-19 Tracker</h2>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={selectedCountry}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>

              {countries.map((country) => {
                return (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            title="Cases"
            cases={countryData.todayCases}
            total={countryData.cases}
          />
          <InfoBox
            title="Recovered"
            cases={countryData.todayRecovered}
            total={countryData.recovered}
          />
          <InfoBox
            title="Deaths"
            cases={countryData.todayDeaths}
            total={countryData.deaths}
          />
        </div>
      </div>

      <div className="app__right">
        {/* Table */}
        <Card>
          <CardContent>
            <h3>Live Cases by country</h3>
            <Table countries={tableData} />
            <h3>Worldwide New Cases</h3>
          </CardContent>
        </Card>
        {/* Graph */}
      </div>

      {/* Map */}
    </div>
  );
}

export default App;
