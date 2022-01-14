import "./css/App.css";
import "leaflet/dist/leaflet.css";
import logo from "./public/logo.png";
import moment from "moment";

import { useState, useEffect, useRef } from "react";

import {
  Card,
  FormControl,
  Select,
  MenuItem,
  CardContent,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
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
  const [vaccineData, setVaccineData] = useState({});
  const [mapVaxData, setMapVaxData] = useState();

  const [activeCaseType, setactiveCaseType] = useState("cases");
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState(worldCenter);
  const [mapZoom, setMapZoom] = useState(2);
  const [yesterdayFlag, setYesterdayFlag] = useState(false);

  const mapRef = useRef();

  const api_url = "https://www.disease.sh/v3/covid-19/";
  const vaccine_url = api_url + "vaccine/coverage/";

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

    const getVaxInfo = async () => {
      await fetch(vaccine_url + "countries")
        .then((response) => response.json())
        .then((data) => {
          let vax_data = {};
          for (let country of data) {
            vax_data[country.country] = Object.values(country.timeline)[0];
          }
          setMapVaxData(vax_data);
        });
    };

    getCountryInfo();
    getVaxInfo();
  }, [vaccine_url]);

  useEffect(() => {
    const url =
      selectedCountry === "worldwide"
        ? api_url + "all"
        : api_url + `countries/${selectedCountry}?allowNull=true`;

    const vaccine_parameters =
      selectedCountry === "worldwide"
        ? vaccine_url + "?lastdays=2"
        : vaccine_url + `countries/${selectedCountry}?lastdays=2`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.todayCases === null) {
          setYesterdayFlag(true);
          fetch(url + "&yesterday=true")
            .then((response) => response.json())
            .then((data) => setCountryData(data));
        } else {
          setCountryData(data);
          setYesterdayFlag(false);
        }
        setMapCenter(
          selectedCountry === "worldwide"
            ? worldCenter
            : [data.countryInfo.lat, data.countryInfo.long]
        );
      });

    fetch(vaccine_parameters)
      .then((response) => response.json())
      .then((data) => {
        if (selectedCountry !== "worldwide") data = data.timeline;
        setVaccineData(data);
      });

    // eslint-disable-next-line
  }, [selectedCountry]);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    setMapZoom(countryCode === "worldwide" ? 2 : 4);
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

        <div className="app__lastUpdated">
          <Alert
            className={
              "app__lastUpdated__alert" +
              (yesterdayFlag ? "--warning" : "--info")
            }
            severity={yesterdayFlag ? "warning" : "info"}
            icon={<AccessTimeIcon fontSize="inherit" />}
          >
            {"Figures updated " +
              (yesterdayFlag
                ? moment().subtract(1, "days").fromNow()
                : moment(countryData.updated).fromNow())}
          </Alert>
        </div>

        <div className="app__stats">
          <InfoBox
            active={activeCaseType === "cases"}
            title="Total Cases"
            value="cases"
            cases={countryData.todayCases}
            total={countryData.cases}
            onClick={(e) => setactiveCaseType("cases")}
          />
          <InfoBox
            active={activeCaseType === "active"}
            title="Active Cases"
            value="active"
            cases={
              countryData.todayCases === null
                ? null
                : countryData.todayCases - countryData.todayRecovered
            }
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
            cases={
              countryData.todayCases === null
                ? null
                : countryData.todayDeaths === null
                ? 0
                : countryData.todayDeaths
            }
            total={countryData.deaths}
            onClick={(e) => setactiveCaseType("deaths")}
          />
          <InfoBox
            active={activeCaseType === "vaccinations"}
            title="Vaccinations"
            value="vaccinations"
            cases={Math.abs(
              Object.values(vaccineData)[0] - Object.values(vaccineData)[1]
            )}
            total={Object.values(vaccineData)[0]}
            onClick={(e) => setactiveCaseType("vaccinations")}
          />
        </div>

        <Map
          className="app__map"
          countries={mapCountries}
          vaccinations={mapVaxData}
          activeCaseType={activeCaseType}
          center={mapCenter}
          zoom={mapZoom}
          ref={mapRef}
        />
      </div>

      <div className="app__right">
        <Card>
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table className="app__table" countries={tableData} />
            <LineGraph
              className="app__graph"
              casesType={
                activeCaseType === "active" || activeCaseType === "recovered"
                  ? "cases"
                  : activeCaseType
              }
              country={selectedCountry}
            />
          </CardContent>
        </Card>

        <p className="app__king">
          Made with ❤️ by{" "}
          <a
            href="https://tarek-radwan.web.app"
            target="_blank"
            rel="noreferrer"
          >
            Tarek Radwan
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
