import getAngleForPositionMidpoint from "./getAngleForPositionMidpoint";
import PositionAnnotationOnCircle from "./PositionAnnotationOnCircle";
import shouldFlipText from "./shouldFlipText";
import React from "react";
import calculateTickMarkPositionsForGivenRange from "../utils/calculateTickMarkPositionsForGivenRange";
import { divideBy3 } from "../utils/proteinUtils";

function Axis({
  radius,
  sequenceLength,
  rotation,
  showAxisNumbers,
  circularAndLinearTickSpacing,
  tickMarkHeight = 5,
  tickMarkWidth = 1,
  textOffset = 15,
  ringThickness = 4,
  isProtein,
  zoomLevel
}) {
  // const percentToShow = zoomLevel/
  // sequenceLength

  const height =
    (ringThickness + (showAxisNumbers ? textOffset + tickMarkHeight : 0)) /
    zoomLevel;
  const radiusToUse = showAxisNumbers
    ? radius + textOffset + tickMarkHeight
    : radius;
  const tickPositions = calculateTickMarkPositionsForGivenRange({
    range: {
      start: 0,
      end: sequenceLength
    },
    tickSpacing: circularAndLinearTickSpacing,
    sequenceLength,
    isProtein
  });

  const tickMarksAndLabels = showAxisNumbers
    ? tickPositions.map(function (tickPosition, index) {
        const tickAngle = getAngleForPositionMidpoint(
          tickPosition,
          sequenceLength
        );

        return (
          <g
            key={"axis" + index}
            {...PositionAnnotationOnCircle({
              sAngle: tickAngle,
              eAngle: tickAngle,
              height: radiusToUse
            })}
          >
            <text
              transform={
                (shouldFlipText(tickAngle - rotation) ? "rotate(180)" : "") +
                ` translate(0, ${
                  shouldFlipText(tickAngle - rotation)
                    ? -textOffset
                    : textOffset
                })`
              }
              style={{
                textAnchor: "middle",
                dominantBaseline: "central",
                fontSize: "small"
              }}
            >
              {divideBy3(tickPosition + 1, isProtein) + ""}
            </text>
            <rect width={tickMarkWidth} height={tickMarkHeight} />
          </g>
        );
      })
    : null;
  const component = (
    <g key="veAxis" className="veAxis">
      <circle
        className="veAxisFill"
        id="circularViewAxis"
        key="circleOuter"
        r={radiusToUse + ringThickness}
        style={{ fill: "white", stroke: "black", strokeWidth: 0.5 }}
      />
      <circle
        id="circularViewAxis"
        key="circle"
        r={radiusToUse}
        style={{ fill: "white", stroke: "black", strokeWidth: 0.5 }}
      />
      {tickMarksAndLabels}
    </g>
  );
  return {
    component,
    height
  };
}

export default Axis;
