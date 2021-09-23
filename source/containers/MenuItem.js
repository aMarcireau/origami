import React from "react";
import Radium from "radium";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { acquireMouse, releaseMouse } from "../actions/manageMouse";
import { openMenuItem, closeMenu } from "../actions/manageMenu";

class HorizontallyMovable extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        shortcut: PropTypes.string,
        left: PropTypes.number.isRequired,
        elements: PropTypes.array,
    };

    constructor(props) {
        super(props);
        this.modifier = navigator.platform.slice(0, 3) === "Mac" ? "⌘" : "^";
    }

    render() {
        return (
            <div
                style={{
                    position: "absolute",
                    left: `${this.props.left}px`,
                    zIndex: "60",
                }}
            >
                <div
                    key={`${this.props.id}-title`}
                    onMouseEnter={this.onMouseEnter.bind(this)}
                    onClick={this.onClick.bind(this)}
                    style={{
                        color:
                            (this.props.activeShortcut !== null &&
                                this.props.elements.some(
                                    element =>
                                        this.props.activeShortcut ===
                                        element.shortcut
                                )) ||
                            this.props.id === this.props.activeMenuItem
                                ? this.props.colors.active
                                : this.props.colors.link,
                        height: "39px",
                        lineHeight: "39px",
                        fontSize: "14px",
                        fontFamily: "roboto",
                        textAlign: "center",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        borderRight: `1px solid ${this.props.colors.sideSeparator}`,
                        cursor: "pointer",
                        ":hover": {
                            color: this.props.colors.active,
                        },
                    }}
                >
                    {this.props.name}
                </div>
                {this.props.id === this.props.activeMenuItem && (
                    <div
                        key={`${this.props.id}-popup-wrapper`}
                        style={{
                            position: "absolute",
                            overflowY: "hidden",
                            left: this.props.left > 0 ? "-1px" : "0px",
                            top: "40px",
                            margin: "0 -10px",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            paddingBottom: "10px",
                        }}
                    >
                        <div
                            key={`${this.props.id}-popup`}
                            style={{
                                //                                position: 'absolute',

                                backgroundColor:
                                    this.props.colors.sideBackground,
                                borderRight: `1px solid ${this.props.colors.sideSeparator}`,
                                borderLeft:
                                    this.props.left > 0
                                        ? `1px solid ${this.props.colors.sideSeparator}`
                                        : "none",
                                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                            }}
                        >
                            {this.props.elements.map((element, index) => (
                                <div
                                    key={`${this.props.hash}-${this.props.id}-${element.name}-${index}-wrapper`}
                                >
                                    <div
                                        key={`${this.props.hash}-${this.props.id}-${element.name}-${index}`}
                                        style={{
                                            whiteSpace: "nowrap",
                                            lineHeight: "30px",
                                            cursor:
                                                element.onClick == null
                                                    ? ""
                                                    : "pointer",
                                            ":hover": {},
                                        }}
                                    >
                                        <div
                                            key={`${this.props.hash}-${this.props.id}-${element.name}-${index}-name`}
                                            style={{
                                                display: "inline-block",
                                                width: "calc(100% - 60px)",
                                                fontSize: "14px",
                                                fontFamily: "robotoLight",
                                                paddingLeft: "10px",
                                                paddingRight: "10px",
                                                whiteSpace: "nowrap",
                                                color:
                                                    element.onClick == null
                                                        ? this.props.colors
                                                              .secondaryContent
                                                        : Radium.getState(
                                                              this.state,
                                                              `${this.props.hash}-${this.props.id}-${element.name}-${index}`,
                                                              ":hover"
                                                          )
                                                        ? this.props.colors
                                                              .active
                                                        : this.props.colors
                                                              .link,
                                            }}
                                            onClick={() => {
                                                if (element.onClick != null) {
                                                    this.props.dispatch(
                                                        closeMenu()
                                                    );
                                                    element.onClick();
                                                }
                                            }}
                                        >
                                            {element.name}
                                        </div>
                                        <div
                                            style={{
                                                display: "inline-block",
                                                width: "40px",
                                                paddingLeft: "10px",
                                                textAlign: "right",
                                                fontSize: "14px",
                                                fontFamily: "robotoLight",
                                                color:
                                                    element.onClick == null
                                                        ? this.props.colors
                                                              .secondaryContent
                                                        : Radium.getState(
                                                              this.state,
                                                              `${this.props.hash}-${this.props.id}-${element.name}-${index}`,
                                                              ":hover"
                                                          )
                                                        ? this.props.colors
                                                              .active
                                                        : this.props.colors
                                                              .link,
                                            }}
                                        >
                                            {`${
                                                element.shortcut !==
                                                element.shortcut.toLowerCase()
                                                    ? "⇧"
                                                    : ""
                                            }${this.modifier}`}
                                        </div>
                                        <div
                                            style={{
                                                display: "inline-block",
                                                width: "20px",
                                                paddingRight: "10px",
                                                fontSize: "14px",
                                                fontFamily: "robotoLight",
                                                color:
                                                    element.onClick == null
                                                        ? this.props.colors
                                                              .secondaryContent
                                                        : Radium.getState(
                                                              this.state,
                                                              `${this.props.hash}-${this.props.id}-${element.name}-${index}`,
                                                              ":hover"
                                                          )
                                                        ? this.props.colors
                                                              .active
                                                        : this.props.colors
                                                              .link,
                                            }}
                                        >
                                            {element.shortcut.toUpperCase()}
                                        </div>
                                    </div>
                                    {(element.separator ||
                                        index ===
                                            this.props.elements.length - 1) && (
                                        <div
                                            style={{
                                                height: "5px",
                                                borderBottom: `1px solid ${this.props.colors.sideSeparator}`,
                                            }}
                                        />
                                    )}
                                    {element.separator &&
                                        index <
                                            this.props.elements.length - 1 && (
                                            <div
                                                style={{
                                                    height: "5px",
                                                }}
                                            />
                                        )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    onMouseEnter() {
        if (
            this.props.activeMenuItem != null &&
            this.props.activeMenuItem !== this.props.id
        ) {
            this.props.dispatch(openMenuItem(this.props.id));
        }
    }

    onClick() {
        if (this.props.activeMenuItem == null) {
            this.props.dispatch(openMenuItem(this.props.id));
        } else {
            this.props.dispatch(closeMenu());
        }
    }
}

export default connect(state => {
    return {
        activeMenuItem: state.menu.activeItem,
        hash: state.menu.hash,
        activeShortcut: state.menu.activeShortcut,
        colors: state.colors,
    };
})(Radium(HorizontallyMovable));
