import React, { forwardRef } from "react";
import { prettyPrint, prettyPercent, casesTypeColors } from "../util";
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

  map.flyTo(center, zoom, {
    animate: true,
    duration: 1.25,
    easeLinearity: 0.25,
  });
  return null;
}

const mapOverlay = (data, vaxData, casesType) => {
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
      radius={getRadius(casesType, country, vaxData)}
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
          <div className="info-vaccinations">
            Vaccinated:{" "}
            {prettyPercent(vaxData?.[country.country] / 2 / country.population)}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
};

function getRadius(casesType, country, vaxData) {
  if (casesType !== "vaccinations")
    return (
      Math.sqrt(Math.abs(country[casesType]) + 1) *
      casesTypeColors[casesType].multiplier
    );
  else if (
    isNaN(
      Math.sqrt(vaxData[country.country] / country.population) *
        casesTypeColors[casesType].multiplier
    )
  )
    return 1;
  else
    return (
      Math.sqrt(vaxData[country.country] / country.population) *
      casesTypeColors[casesType].multiplier
    );
}

function Map(
  { countries, vaccinations, activeCaseType, center, zoom, ...props },
  ref
) {
  return (
    <div className={props.className} ref={ref}>
      <LeafletMap center={center} zoom={zoom} scrollWheelZoom={false}>
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapOverlay(countries, vaccinations, activeCaseType)}
      </LeafletMap>
    </div>
  );
}

export default forwardRef(Map);
