import React, { useState, useEffect } from "react";
import { casesTypeColors } from "../util";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: true,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType = "cases", country = "all") => {
  let chartData = [];
  let lastDataPoint;
  let timeline;
  if (casesType === "vaccinations")
    timeline = country === "all" ? data : data.timeline;
  else if (country === "all") timeline = data?.cases;
  else timeline = data?.timeline?.cases;

  for (let date in timeline) {
    let number = timeline[date];
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: Math.abs(number - lastDataPoint),
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = number;
  }

  return chartData;
};

function LineGraph({ casesType, country, ...props }) {
  const [data, setData] = useState({});
  const [countryName, setCountryName] = useState("worldwide");

  useEffect(() => {
    const fetchData = async () => {
      let caseType = casesType;
      let code = country === "worldwide" ? "all" : country.toLowerCase();
      await fetch(
        casesType === "vaccinations"
          ? `https://disease.sh/v3/covid-19/vaccine/coverage${
              code === "all" ? "" : `/countries/${code}`
            }?lastdays=120`
          : `https://disease.sh/v3/covid-19/historical/${code}?lastdays=120`
      )
        .then((response) => {
          if (response.ok) return response.json();
          else return null;
        })
        .then((data) => {
          if (data !== null) {
            if (country !== "worldwide") setCountryName(data.country);
            else setCountryName("worldwide");
            let chartData = buildChartData(data, caseType, code);
            setData(chartData);
          }
        });
    };

    fetchData();
  }, [casesType, country]);

  return (
    <div className={props.className}>
      <h3>
        {countryName} New{" "}
        {casesType === "active" || casesType === "recovered"
          ? "Cases"
          : casesType}
      </h3>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: `${casesTypeColors[casesType].lighter}`,
                borderColor: `${casesTypeColors[casesType].hex}`,
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;
