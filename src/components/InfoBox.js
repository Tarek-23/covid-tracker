import React from "react";
import "../css/Infobox.css";
import { Card, CardContent, Typography } from "@material-ui/core";
import { prettyPrint } from "../util";

function InfoBox({ title, cases, total, active, value, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox  ${active && "infoBox--selected"} ${
        "infoBox--" + value
      }`}
    >
      <CardContent>
        {/* Content title */}
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>

        {/* New today */}
        <h2 className={`infoBox__cases ${"infoBox__cases--" + value}`}>
          +{prettyPrint(cases, true)}
        </h2>

        {/* Total */}
        <Typography className="infoBox__total" color="textSecondary">
          {prettyPrint(total, true)} total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
