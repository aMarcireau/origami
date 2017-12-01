import React from 'react'
import Radium from 'radium'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {
    removeWarning,
    removeAllWarnings,
} from '../actions/manageWarning'
import List from '../components/List'

class Warnings extends React.Component {

    static propTypes = {
        style: PropTypes.object,
    }

    render() {
        return (
            <div style={this.props.style}>
                <List
                    elementsPerPage={10}
                    elements={this.props.warnings}
                    emptyContent={
                        <div style={{
                            color: this.props.colors.secondaryContent,
                            fontSize: '14px',
                            fontFamily: 'robotoLight',
                            textAlign: 'center',
                            paddingTop: '10px',
                            paddingRight: '10px',
                            paddingLeft: '10px',
                        }}>There are no warnings</div>
                    }
                    pageFromElements={(elements, list) => (
                        <ul style={{
                            listStyleType: 'none',
                            margin: 0,
                            padding: 0,
                        }}>{elements.map((element, index) => (
                            <li
                                key={`${index}-${this.props.hash}`}
                                style={{
                                    borderBottom: `solid 1px ${this.props.colors.sideSeparator}`,
                                    borderLeft: `solid 3px ${element.level == 'error' ? this.props.colors.error : this.props.colors.warning}`,
                                    height: '50px',
                                    position: 'relative',
                                }}
                            >
                                <div style={{
                                    width: 'calc(100% - 40px)',
                                    height: '49px',
                                    paddingTop: '6px',
                                    paddingRight: '6px',
                                    paddingBottom: '6px',
                                    paddingLeft: '6px',
                                }}>
                                    <p style={{
                                        fontSize: '14px',
                                        color: this.props.colors.content,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        marginTop: 0,
                                        marginRight: 0,
                                        marginBottom: '6px',
                                        marginLeft: 0,
                                        height: '16px',
                                        lineHeight: '16px',
                                        userSelect: 'text',
                                    }}>{element.title}</p>
                                    <p style={{
                                        color: this.props.colors.secondaryContent,
                                        fontSize: '14px',
                                        margin: 0,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        height: '16px',
                                        lineHeight: '16px',
                                        userSelect: 'text',
                                    }}>{element.subtitle}</p>
                                </div>
                                <button
                                    key={`${index}-${this.props.hash}-warnings-remove-button`}
                                    style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: 0,
                                        width: '40px',
                                        height: '49px',
                                        textDecoration: 'none',
                                        paddingTop: '5px',
                                        paddingRight: 0,
                                        paddingBottom: 0,
                                        paddingLeft: 0,
                                        borderTop: 'none',
                                        borderRight: 'none',
                                        borderBottom: 'none',
                                        borderLeft: `1px solid ${this.props.colors.sideSeparator}`,
                                        display: 'inline-block',
                                        textAlign: 'center',
                                        outline: 'none',
                                        backgroundColor: this.props.colors.sideBackground,
                                        ':hover': {
                                            cursor: 'pointer',
                                        },
                                        ':active': {
                                            backgroundColor: this.props.colors.background,
                                        },
                                    }}
                                    onClick={() => {
                                        this.props.dispatch(removeWarning(index));
                                    }}
                                >
                                    <svg viewBox="0 0 40 40">
                                        <rect
                                            style={{
                                                fill: (Radium.getState(list.state, `${index}-${this.props.hash}-warnings-remove-button`, ':hover') ? this.props.colors.error : this.props.colors.link),
                                            }}
                                            transform="translate(20.000000, 20.000000) rotate(45.000000) translate(-20.000000, -20.000000)"
                                            x="19"
                                            y="10"
                                            width="2"
                                            height="20"
                                        />
                                        <rect
                                            style={{
                                                fill: (Radium.getState(list.state, `${index}-${this.props.hash}-warnings-remove-button`, ':hover') ? this.props.colors.error : this.props.colors.link),
                                            }}
                                            transform="translate(20.000000, 20.000000) rotate(-45.000000) translate(-20.000000, -20.000000)"
                                            x="19"
                                            y="10"
                                            width="2"
                                            height="20"
                                        />
                                    </svg>
                                </button>
                            </li>
                        ))}</ul>
                    )}
                    colors={this.props.colors}
                />

                {this.props.warnings.length > 0 && (
                    <button
                        key={`${this.props.hash}-warnings-remove-all-button`}
                        style={{
                            textDecoration: 'none',
                            paddingTop: '0px',
                            paddingRight: '6px',
                            paddingBottom: '0px',
                            paddingLeft: '6px',
                            height: '40px',
                            lineHeight: '40px',
                            borderTop: 'none',
                            borderRight: 'none',
                            borderBottom: `solid 1px ${this.props.colors.sideSeparator}`,
                            borderLeft: 'none',
                            display: 'block',
                            textAlign: 'center',
                            outline: 'none',
                            fontSize: '14px',
                            fontFamily: 'robotoLight',
                            color: this.props.colors.link,
                            backgroundColor: this.props.colors.sideBackground,
                            width: '100%',
                            ':hover': {
                                cursor: 'pointer',
                                color: this.props.colors.error,
                            },
                        }}
                        onClick={() => {
                            this.props.dispatch(removeAllWarnings());
                        }}
                    >Remove all</button>
                )}
            </div>
        )
    }
}

export default connect(
    state => {
        return {
            warnings: state.warnings.list,
            hash: state.warnings.hash,
            colors: state.colors,
        };
    }
)(Radium(Warnings));
