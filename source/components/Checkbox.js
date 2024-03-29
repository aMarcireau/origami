import React from "react";
import Radium from "radium";
import PropTypes from "prop-types";

class Checkbox extends React.Component {
    static propTypes = {
        checked: PropTypes.bool.isRequired,
        onClick: PropTypes.func.isRequired,
        colors: PropTypes.object.isRequired,
    };

    render() {
        return (
            <div
                onClick={this.props.onClick}
                style={{
                    width: "20px",
                    height: "20px",
                    border: `1px solid ${this.props.colors.sideSeparator}`,
                    cursor: "pointer",
                    ":hover": {
                        backgroundColor: this.props.colors.sideBackground,
                    },
                    display: "inline-block",
                    position: "relative",
                }}
            >
                {this.props.checked && (
                    <svg
                        viewBox="0 0 39 39"
                        style={{
                            width: "18px",
                            height: "18px",
                            position: "absolute",
                            top: 0,
                            left: 0,
                        }}
                    >
                        <path
                            style={{
                                fill: this.props.colors.valid,
                            }}
                            d="M23.4461524,8.86121593 L25.4461524,8.86121593 L25.4461524,23.8612159 L23.4461524,23.8612159 L23.4461524,8.86121593 Z M14.4461524,23.8612159 L25.4461524,23.8612159 L25.4461524,25.8612159 L14.4461524,25.8612159 L14.4461524,23.8612159 Z"
                            transform="translate(19.946152, 17.361216) rotate(30.000000) translate(-19.946152, -17.361216)"
                        />
                    </svg>
                )}
            </div>
        );
    }
}

export default Radium(Checkbox);
