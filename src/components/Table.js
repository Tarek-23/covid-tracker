import React from "react";
import { prettyPrint } from "../util";
import "../css/Table.css";
// import { Table as MaterialTable } from "@material-ui/core";

function Table({ countries }) {
  return (
    <div className="table">
      <table>
        <tbody>
          {countries.map((country) => (
            <tr>
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
