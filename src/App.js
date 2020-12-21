import "./App.css";
import { useState, useEffect } from "react";
import { FormControl, Select, MenuItem } from "@material-ui/core";

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("worldwide");
  const api_url = "https://www.disease.sh/v3/covid-19/countries";

  useEffect(() => {
    const getCountryData = async () => {
      await fetch(api_url)
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          setCountries(countries);
        });
    };

    getCountryData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
  };
  return (
    <div className="app">
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
              return <MenuItem value={country.value}>{country.name}</MenuItem>;
            })}
          </Select>
        </FormControl>

        {/* <Infobox/> Display total + new
        <Infobox/> Display recovered + new
        <Infobox/> Display deaths + new */}
      </div>
    </div>
  );
}

export default App;
