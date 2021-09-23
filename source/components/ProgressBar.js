import React from "react";
import PropTypes from "prop-types";

class ProgressBar extends React.Component {
    static propTypes = {
        begin: PropTypes.number,
        end: PropTypes.number,
        color: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            now: 0,
        };
        this.interval = null;
    }

    componentDidMount() {
        this.interval = window.setInterval(() => {
            this.setState({ now: Date.now() });
        }, 20);
    }

    componentWillUnmount() {
        window.clearInterval(this.interval);
    }

    render() {
        return (
            <div
                style={{
                    height: "3px",
                }}
            >
                <div
                    style={{
                        width:
                            this.props.begin != null && this.props.end != null
                                ? `${
                                      Math.min(
                                          1,
                                          Math.max(
                                              0,
                                              (this.state.now -
                                                  this.props.begin) /
                                                  (this.props.end -
                                                      this.props.begin)
                                          )
                                      ) * 100
                                  }%`
                                : "100%",
                        height: "3px",
                        backgroundColor: this.props.color,
                    }}
                />
            </div>
        );
    }
}

export default ProgressBar;
