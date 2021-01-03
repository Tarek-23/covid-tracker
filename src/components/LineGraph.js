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
  casesType = casesType === "active" ? "cases" : casesType;
  let chartData = [];
  let lastDataPoint;
  if (country === "all") {
    for (let date in data.cases) {
      if (lastDataPoint) {
        let newDataPoint = {
          x: date,
          y: Math.abs(data[casesType][date] - lastDataPoint),
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
  } else {
    for (let date in data.timeline.cases) {
      if (lastDataPoint) {
        let newDataPoint = {
          x: date,
          y: Math.abs(data.timeline[casesType][date] - lastDataPoint),
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data.timeline[casesType][date];
    }
  }

  return chartData;
};

function LineGraph({ casesType, country, ...props }) {
  const [data, setData] = useState({});
  const [countryName, setCountryName] = useState("worldwide");

  useEffect(() => {
    const fetchData = async () => {
      let code = country === "worldwide" ? "all" : country.toLowerCase();
      await fetch(
        `https://disease.sh/v3/covid-19/historical/${code}?lastdays=120`
      )
        .then((response) => {
          if (response.ok) return response.json();
          else return null;
        })
        .then((data) => {
          if (data !== null) {
            if (country !== "worldwide") setCountryName(data.country);
            let chartData = buildChartData(data, casesType, code);
            setData(chartData);
          }
        });
    };

    fetchData();
  }, [casesType, country]);

  return (
    <div className={props.className}>
      <h3>
        {countryName} New {casesType === "active" ? "Cases" : casesType}
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
