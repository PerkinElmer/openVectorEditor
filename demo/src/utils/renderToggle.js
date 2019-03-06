import React from "react";
import { Switch, Button } from "@blueprintjs/core";
import { InfoHelper } from "teselagen-react-components";
import { lifecycle, mapProps } from "recompose";
import { omit } from "lodash";

const omitProps = keys => mapProps(props => omit(props, keys));
const _Switch = omitProps(["didMount"])(Switch);
const EnhancedSwitch = lifecycle({
  componentDidMount() {
    return this.props.didMount();
  }
})(_Switch);

export default function renderToggle({
  isButton,
  that,
  type,
  label,
  onClick,
  description,
  hook
}) {
  let toggleOrButton;
  const labelOrText = label ? <span>{label}</span> : type;
  const sharedProps = {
    "data-test": type,
    style: { margin: "0px 30px", marginTop: 4 },
    label: labelOrText,
    text: labelOrText
  };
  if (isButton) {
    toggleOrButton = (
      <Button
        {...{
          ...sharedProps,
          onClick: onClick || hook
        }}
      />
    );
  } else {
    toggleOrButton = (
      <EnhancedSwitch
        {...{
          ...sharedProps,
          didMount: () => {
            hook && hook(!!(that.state || {})[type]);
          },
          checked: (that.state || {})[type],
          onChange: () => {
            hook && hook(!(that.state || {})[type]);
            that.setState({
              [type]: !(that.state || {})[type]
            });
          }
        }}
      />
    );
  }
  return (
    <div style={{ display: "flex" }} className="toggle-button-holder">
      {description && (
        <InfoHelper
          popoverProps={{
            preventOverflow: { enabled: false },
            hide: {
              enabled: false
            },
            flip: {
              boundariesElement: "viewport"
            }
          }}
          style={{ marginRight: -15, marginTop: 5, marginLeft: 5 }}
        >
          {description}
        </InfoHelper>
      )}
      {toggleOrButton}
    </div>
  );
}
