import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import NumericLabel from "react-pretty-numbers";

function InfoBox({ title, cases, total }) {
  let params = {
    shortFormat: "true",
    shortFormatPrecision: 1,
    shortFormatMinValue: "1000",
    justification: "L",
  };
  return (
    <Card className="infoBox">
      <CardContent>
        {/* Content title */}
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>

        {/* New today */}
        <h2 className="infoBox__cases">
          +<NumericLabel params={params}>{cases}</NumericLabel>
        </h2>

        {/* Total */}
        <Typography className="infoBox__total" color="textSecondary">
          <NumericLabel params={params}>{total}</NumericLabel> total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
