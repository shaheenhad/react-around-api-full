import React from "react";
import { withRouter } from "react-router-dom";

class InfoTooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={`popup ${this.props.isOpen && `popup_is-visible`}`}>
        <div className="popup__container">
          <button
            type="button"
            className="popup__close"
            onClick={this.props.onClose}
          />
          <div className="popup__form">
            <div
              className={`popup__tooltip-icon ${
                this.props.success
                  ? `popup__tooltip-icon_success`
                  : `popup__tooltip-icon_failure`
              }`}
            />
            <h2 className="popup__tooltip-text">
              {this.props.success
                ? "Success! You have now been registered."
                : "Oops, something went wrong! Please try again."}
            </h2>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(InfoTooltip);
