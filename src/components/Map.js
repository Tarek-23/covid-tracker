import React from "react";
import { prettyPrint } from "../util";
import {
  MapContainer as LeafletMap,
  TileLayer,
  useMap,
  Circle,
  Popup,
} from "react-leaflet";
import "../css/Map.css";

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const casesTypeColors = {
  cases: {
    hex: "#FB4443",
    multiplier: 300,
  },

  active: {
    hex: "#E67300",
    multiplier: 350,
  },

  recovered: {
    hex: "#7DD71D",
    multiplier: 350,
  },

  deaths: {
    hex: "#CC1034",
    multiplier: 1000,
  },
};

const mapOverlay = (data, casesType) => {
  //   const normalizedTotal = Math.sqrt(
  //     data.reduce((a, b) => a + Math.pow(b[casesType], 2), 0)
  //   );

  return data.map((country) => (
    <Circle
      key={country.country}
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      pathOptions={{
        color: casesTypeColors[casesType].hex,
        fillColor: casesTypeColors[casesType].hex,
      }}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
        // (country[casesType] / normalizedTotal) *
        // casesTypeColors[casesType].multiplier
      }
    >
      <Popup className="info">
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className="info-name">{country.country}</div>
          <div className="info-cases">
            Total cases: {prettyPrint(country.cases)}
          </div>
          <div className="info-active">
            Active cases: {prettyPrint(country.active)}
          </div>
          <div className="info-recovered">
            Recoveries: {prettyPrint(country.recovered)}
          </div>
          <div className="info-deaths">
            Deaths: {prettyPrint(country.deaths)}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
};

function Map({ countries, activeCaseType, center, zoom, ...props }) {
  return (
    <div className={props.className}>
      <LeafletMap center={center} zoom={zoom} scrollWheelZoom={false}>
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapOverlay(countries, activeCaseType)}
      </LeafletMap>
    </div>
  );
}

export default Map;
