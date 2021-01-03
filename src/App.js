import "./css/App.css";
import "leaflet/dist/leaflet.css";
import logo from "./public/logo.png";

import { useState, useEffect } from "react";
// import useSwr from "swr";

import {
  Card,
  FormControl,
  Select,
  MenuItem,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./components/InfoBox";
import Table from "./components/Table";
import Map from "./components/Map";
import LineGraph from "./components/LineGraph";
import { sortTable } from "./util";

function App() {
  const worldCenter = [34.80746, 15.4796];
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("worldwide");
  const [mapCountries, setmapCountries] = useState([]);
  const [countryData, setCountryData] = useState({});

  const [activeCaseType, setactiveCaseType] = useState("cases");
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState(worldCenter);
  const [mapZoom, setMapZoom] = useState(2);

  // const mapRef = useRef();

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
          setmapCountries(data);
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
        setMapCenter(
          selectedCountry === "worldwide"
            ? worldCenter
            : [data.countryInfo.lat, data.countryInfo.long]
        );
      });

    // eslint-disable-next-line
  }, [selectedCountry]);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    setMapZoom(countryCode === "worldwide" ? 2 : 4);
    // mapRef.current.scrollIntoView(false, { behavior: "smooth" });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <img className="app__header__logo" src={logo} alt="logo" />
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={selectedCountry}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>

              {countries.map((country) => {
                return (
                  <MenuItem value={country.value} key={country.name}>
                    {country.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>

        {/* <div className="app__lastUpdated">
          {"Last updated at " + Date(selectedCountry.updated).toString()}
        </div> */}

        <div className="app__stats">
          <InfoBox
            active={activeCaseType === "cases"}
            value="cases"
            title="Total Cases"
            cases={countryData.todayCases}
            total={countryData.cases}
            onClick={(e) => setactiveCaseType("cases")}
          />
          <InfoBox
            active={activeCaseType === "active"}
            title="Active Cases"
            value="active"
            cases={countryData.todayCases}
            total={countryData.active}
            onClick={(e) => setactiveCaseType("active")}
          />
          <InfoBox
            active={activeCaseType === "recovered"}
            title="Recovered"
            value="recovered"
            cases={countryData.todayRecovered}
            total={countryData.recovered}
            onClick={(e) => setactiveCaseType("recovered")}
          />
          <InfoBox
            active={activeCaseType === "deaths"}
            title="Deaths"
            value="deaths"
            cases={countryData.todayDeaths}
            total={countryData.deaths}
            onClick={(e) => setactiveCaseType("deaths")}
          />
        </div>

        <Map
          className="app__map"
          countries={mapCountries}
          activeCaseType={activeCaseType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <div className="app__right">
        <Card>
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table className="app__table" countries={tableData} />
            <LineGraph
              className="app__graph"
              casesType={activeCaseType}
              country={selectedCountry}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
