import React from 'react'
import Radium from 'radium'
import PropTypes from 'prop-types'

class ConfirmationButton extends React.Component {

    static propTypes = {
        numberOfPublications: PropTypes.number.isRequired,
        onClick: PropTypes.func.isRequired,
        colors: PropTypes.object.isRequired,
        componentKey: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            switched: false,
            hash: 0,
        };
    }

    render() {
        return (
            <div key={this.props.componentKey}>
                {this.state.switched ? (
                    <div
                        key='switched'
                        style={{
                            width: '100%',
                        }}
                    >
                        <div style={{
                            padding: '10px',
                            borderBottom: `solid 1px ${this.props.colors.sideSeparator}`,
                            textAlign: 'center',
                            fontSize: '14px',
                            fontFamily: 'robotoLight',
                            color: this.props.colors.content,
                            backgroundColor: this.props.colors.sideBackground,
                        }}>
                            {`Updating the collection will reload the citers of ${this.props.numberOfPublications} publication${this.props.numberOfPublications > 1 ? 's' : ''}. Do you want to proceed?`}
                        </div>
                        <div>
                            <div
                                key={`${this.state.hash}-cancel`}
                                style={{
                                    display: 'inline-block',
                                    width: '50%',
                                    paddingRight: '6px',
                                    paddingLeft: '6px',
                                    height: '40px',
                                    lineHeight: '40px',
                                    borderRight: `solid 1px ${this.props.colors.sideSeparator}`,
                                    borderBottom: `solid 1px ${this.props.colors.sideSeparator}`,
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    fontFamily: 'robotoLight',
                                    color: this.props.colors.link,
                                    backgroundColor: this.props.colors.sideBackground,
                                    ':hover': {
                                        cursor: 'pointer',
                                        color: this.props.colors.active,
                                    },
                                }}
                                onClick={() => {
                                    this.setState({switched: false, hash: this.state.hash + 1});
                                }}
                            >Cancel</div>
                            <div
                                key={`${this.state.hash}-update`}
                                style={{
                                    display: 'inline-block',
                                    width: '50%',
                                    paddingRight: '6px',
                                    paddingLeft: '6px',
                                    height: '40px',
                                    lineHeight: '40px',
                                    borderBottom: `solid 1px ${this.props.colors.sideSeparator}`,
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    fontFamily: 'robotoLight',
                                    color: this.props.colors.link,
                                    backgroundColor: this.props.colors.sideBackground,
                                    ':hover': {
                                        cursor: 'pointer',
                                        color: this.props.colors.active,
                                    },
                                }}
                                onClick={this.props.onClick}
                            >Update</div>
                        </div>
                    </div>
                ) : (
                    <div
                        key={`${this.state.hash}-not-switched`}
                        style={{
                            paddingRight: '6px',
                            paddingLeft: '6px',
                            height: '40px',
                            lineHeight: '40px',
                            borderBottom: `solid 1px ${this.props.colors.sideSeparator}`,
                            textAlign: 'center',
                            fontSize: '14px',
                            fontFamily: 'robotoLight',
                            color: this.props.colors.link,
                            backgroundColor: this.props.colors.sideBackground,
                            width: '100%',
                            ':hover': {
                                cursor: 'pointer',
                                color: this.props.colors.active,
                            },
                        }}
                        onClick={() => {
                            this.setState({switched: true, hash: this.state.hash + 1});
                        }}
                    >Update the collection</div>
                )}
            </div>
        )
    }
}

export default Radium(ConfirmationButton);
