import React from 'react'
import Radium from 'radium'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {pad} from '../actions/managePublication'
import {
    removeWarning,
    removeAllWarnings,
} from '../actions/manageWarning'
import List from '../components/List'
import {
    CONTENT_COLOR,
    SECONDARY_CONTENT_COLOR,
    SIDE_BACKGROUND_COLOR,
    SIDE_SEPARATOR_COLOR,
    LINK_COLOR,
    WARNING_COLOR,
    ERROR_COLOR,
} from '../constants/styles'

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
                            color: SECONDARY_CONTENT_COLOR,
                            fontSize: '14px',
                            fontFamily: 'robotoLight',
                            textAlign: 'center',
                            paddingTop: '10px',
                        }}>There are no warnings</div>
                    }
                    pageFromElements={(elements, list) => (
                        <ul style={{
                            listStyleType: 'none',
                            margin: 0,
                            padding: 0,
                        }}>{elements.map((element, index) => (
                            <li
                                key={`${index}-${element.timestamp}-${element.message}`}
                                style={{
                                    borderBottom: `solid 1px ${SIDE_SEPARATOR_COLOR}`,
                                    borderLeft: `solid 3px ${element.level == 'error' ? ERROR_COLOR : WARNING_COLOR}`,
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
                                        color: CONTENT_COLOR,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        marginTop: 0,
                                        marginRight: 0,
                                        marginBottom: '6px',
                                        marginLeft: 0,
                                    }}>{element.message}</p>
                                    <p style={{
                                        color: SECONDARY_CONTENT_COLOR,
                                        fontSize: '14px',
                                        margin: 0,
                                    }}>{(() => {
                                        const date = new Date(element.timestamp);
                                        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}, ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
                                    })()}</p>
                                </div>
                                <button
                                    key={`${index}-${element.timestamp}-${element.message}-warnings-remove-button`}
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
                                        borderLeft: `1px solid ${SIDE_SEPARATOR_COLOR}`,
                                        display: 'inline-block',
                                        textAlign: 'center',
                                        outline: 'none',
                                        backgroundColor: SIDE_BACKGROUND_COLOR,
                                        ':hover': {
                                            cursor: 'pointer',
                                        },
                                        ':active': {
                                            backgroundColor: 'white',
                                        },
                                    }}
                                    onClick={() => {
                                        this.props.dispatch(removeWarning(index));
                                    }}
                                >
                                    <svg viewBox="0 0 40 40">
                                        <rect
                                            style={{
                                                fill: (Radium.getState(list.state, `${index}-${element.timestamp}-${element.message}-warnings-remove-button`, ':hover') ? ERROR_COLOR : LINK_COLOR),
                                            }}
                                            transform="translate(20.000000, 20.000000) rotate(45.000000) translate(-20.000000, -20.000000)"
                                            x="19"
                                            y="10"
                                            width="2"
                                            height="20"
                                        />
                                        <rect
                                            style={{
                                                fill: (Radium.getState(list.state, `${index}-${element.timestamp}-${element.message}-warnings-remove-button`, ':hover') ? ERROR_COLOR : LINK_COLOR),
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
                            borderBottom: `solid 1px ${SIDE_SEPARATOR_COLOR}`,
                            borderLeft: 'none',
                            display: 'block',
                            textAlign: 'center',
                            outline: 'none',
                            fontSize: '14px',
                            fontFamily: 'robotoLight',
                            color: LINK_COLOR,
                            backgroundColor: SIDE_BACKGROUND_COLOR,
                            width: '100%',
                            ':hover': {
                                cursor: 'pointer',
                                color: ERROR_COLOR,
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
        };
    }
)(Radium(Warnings));
