import React from "react";
import { prettyPrint } from "../util";
import "../css/Table.css";
// import { Table as MaterialTable } from "@material-ui/core";

function Table({ countries, ...props }) {
  return (
    <div className={props.className}>
      <table>
        <tbody>
          {countries.map((country) => (
            <tr key={country.country}>
              <td>{country.country}</td>
              <td>
                <strong>{prettyPrint(country.cases)}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
