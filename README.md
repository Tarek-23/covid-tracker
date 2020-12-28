# COVID-19 Tracker

This is an implementation for a tracker that visualizes COVID-19 case data using a table, a chart, and an interactive map. Check it out here --> https://covid-19-tracker-9a55e.web.app/

## Data Sources

The data for the table, map, and the infoboxes is retrieved from the Worldometers available at https://www.worldometers.info/coronavirus/ through the open API disease.sh

The historical data for the chart is retrieved from Johns Hopkins University also through the open API at disease.sh

## Features

The dashboard features five elements:

### Dropdown Selector

Choosing a country from here shows specific case counts for that country and automatically pans the map to the selected country.

### Interactive Infoboxes

Each infobox shows the relevant data for the country selected through the dropdown. Each infobox shows the new instances of its respective case (coronavirus cases, active cases, recovered cases, and deaths) as well as the accumulated total for each case. Selecting an infobox also triggers the respective case layer on the map as well as the historical trend for that type of case on the dynamic chart.

### Interactive map

The map visualizes the different types of cases as circles whose radius denotes the number of the cases and whose colour determines the type of cases viewed as per the selected infobox. Clicking a circle triggers a popup with detailed information about the country.

### Live Table

Static table that shows the detailed numbers of coronavirus cases sorted by highest to lowest.

### Dynamic Chart

The chart shows the historical trend for the selected case type over the past 120 days.
