import React from 'react'
import Radium from 'radium'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import Recaptcha from './Recaptcha'
import crossrefQueue from '../queues/crossrefQueue'
import doiQueue from '../queues/doiQueue'
import scholarQueue from '../queues/scholarQueue'
import {
    selectPublication,
    unselectPublication,
} from '../actions/managePublication'
import {changeRecaptchaVisibility} from '../actions/manageScholar'
import List from '../components/List'
import ProgressBar from '../components/ProgressBar'
import {
    PUBLICATION_STATUS_UNVALIDATED,
    PUBLICATION_STATUS_DEFAULT,
    PUBLICATION_STATUS_IN_COLLECTION,
    SCHOLAR_REQUEST_TYPE_INITIALIZE,
    SCHOLAR_REQUEST_TYPE_CITERS,
    CROSSREF_REQUEST_TYPE_VALIDATION,
    CROSSREF_REQUEST_TYPE_CITER_METADATA,
    CROSSREF_REQUEST_TYPE_IMPORTED_METADATA,
    SCHOLAR_STATUS_IDLE,
    SCHOLAR_STATUS_FETCHING,
    SCHOLAR_STATUS_BLOCKED_HIDDEN,
    SCHOLAR_STATUS_BLOCKED_VISIBLE,
    SCHOLAR_STATUS_UNBLOCKING,
} from '../constants/enums'

class Requests extends React.Component {

    static propTypes = {
        height: PropTypes.number.isRequired,
        leftPosition: PropTypes.number.isRequired,
        rightPosition: PropTypes.number.isRequired,
    }

    render() {
        return (
            <div style={{
                height: '100%',
                position: 'relative',
            }}>
                {(
                    this.props.scholarStatus === SCHOLAR_STATUS_UNBLOCKING
                    || this.props.scholarStatus === SCHOLAR_STATUS_BLOCKED_HIDDEN
                    || this.props.scholarStatus === SCHOLAR_STATUS_BLOCKED_VISIBLE
                ) &&
                    <Recaptcha style={{
                        position: 'fixed',
                        top: `${39 + (this.props.scholarStatus === SCHOLAR_STATUS_BLOCKED_VISIBLE ? 0 : this.props.height + 1)}px`,
                        transition: 'top 500ms',
                        left: `${this.props.leftPosition + 1}px`,
                        zIndex: '30',
                        width: `${this.props.rightPosition - this.props.leftPosition - 1}px`,
                        height: `${this.props.height}px`,
                        borderTop: `solid 1px ${this.props.colors.sideSeparator}`,
                    }}/>
                }
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '40px',
                    overflow: 'hidden',
                }}>
                    {(this.props.scholarStatus === SCHOLAR_STATUS_BLOCKED_HIDDEN || this.props.scholarStatus === SCHOLAR_STATUS_BLOCKED_VISIBLE) ? (
                        <button
                            style={{
                                position: 'relative',
                                top: this.props.blocked ? '0px' : '-40px',
                                transition: 'top 500ms',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'block',
                                width: '100%',
                                height: '40px',
                                textDecoration: 'none',
                                outline: 'none',
                                backgroundColor: this.props.colors.error,
                                color: this.props.colors.sideBackground,
                                fontSize: '14px',
                                marginTop: 0,
                                marginRight: 0,
                                marginBottom: '6px',
                                marginLeft: 0,
                                padding: 0,
                                textAlign: 'center',
                                borderTop: 'none',
                                borderRight: 'none',
                                borderBottom: `solid 1px ${this.props.colors.sideSeparator}`,
                                borderLeft: 'none',
                                ':hover': {
                                    cursor: 'pointer',
                                    backgroundColor: this.props.colors.active,
                                },
                            }}
                            onClick={() => {
                                this.props.dispatch(changeRecaptchaVisibility());
                            }}
                        >{this.props.scholarStatus === SCHOLAR_STATUS_BLOCKED_HIDDEN ? 'Fill the reCAPTCHA' : 'Close'}</button>
                    ) : (
                        <p style={{
                            position: 'relative',
                            top: this.props.blocked ? '0px' : '-40px',
                            transition: 'top 500ms',
                            width: '100%',
                            height: '40px',
                            lineHeight: '40px',
                            textAlign: 'center',
                            margin: 0,
                            color: this.props.scholarStatus === SCHOLAR_STATUS_UNBLOCKING && this.props.connected ? this.props.colors.valid : this.props.colors.error,
                            fontSize: '14px',
                            fontFamily: 'robotoLight',
                            borderBottom: `solid 1px ${this.props.colors.sideSeparator}`,
                        }}>{this.props.scholarStatus === SCHOLAR_STATUS_UNBLOCKING && this.props.connected ? 'reCAPTCHA filled' : 'Disconnected'}</p>
                    )}
                </div>
                <div style={{
                    position: 'absolute',
                    top: this.props.blocked ? '40px' : '0px',
                    transition: 'top 500ms',
                    width: '100%',
                    backgroundColor: this.props.colors.sideBackground,
                }}>
                    <div style={{
                        color: this.props.colors.content,
                        fontSize: '14px',
                        fontFamily: 'robotoLight',
                        textAlign: 'center',
                        lineHeight: '39px',
                        height: '40px',
                        borderBottom: `solid 1px ${this.props.colors.sideSeparator}`,
                    }}>Queued requests</div>
                    {this.props.hasPages && (
                        <ProgressBar
                            begin={this.props.beginOfRefractoryPeriod}
                            end={this.props.endOfRefractoryPeriod}
                            color={this.props.blocked ? this.props.colors.error : (this.props.scholarStatus === SCHOLAR_STATUS_FETCHING ? this.props.colors.active : this.props.colors.link)}
                        />
                    )}
                    <div style={{
                        overflowY: 'auto',
                        height: `${this.props.height - 40 - 3 - (this.props.blocked ? 133 : 0)}px`,
                    }}>
                        <List
                            elementsPerPage={10}
                            elements={this.props.requests}
                            emptyContent={
                                <div style={{
                                    color: this.props.colors.secondaryContent,
                                    fontSize: '14px',
                                    fontFamily: 'robotoLight',
                                    textAlign: 'center',
                                    paddingTop: '10px',
                                    paddingRight: '10px',
                                    paddingLeft: '10px',
                                }}>There are no queued requests</div>
                            }
                            pageFromElements={(elements, list) => (
                                <ul style={{
                                    listStyleType: 'none',
                                    margin: 0,
                                    padding: 0,
                                }}>{elements.map((element, index) => (
                                    <li
                                        key={`${index}-${element.id}`}
                                        style={{
                                            borderBottom: `solid 1px ${this.props.colors.sideSeparator}`,
                                            borderLeft: `solid 3px ${element.borderColor}`,
                                            height: '50px',
                                            position: 'relative',
                                        }}
                                    >
                                        <div style={{
                                            width: '100%',
                                            height: '49px',
                                            padding: '6px',
                                        }}>
                                            {element.onTitleClick ? (
                                                <button
                                                    key={`button-${index}-${element.id}`}
                                                    style={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        display: 'block',
                                                        width: '100%',
                                                        textDecoration: 'none',
                                                        border: 'none',
                                                        outline: 'none',
                                                        backgroundColor: this.props.colors.sideBackground,
                                                        color: element.color,
                                                        fontSize: '14px',
                                                        height: '16px',
                                                        lineHeight: '16px',
                                                        marginTop: 0,
                                                        marginRight: 0,
                                                        marginBottom: '6px',
                                                        marginLeft: 0,
                                                        padding: 0,
                                                        textAlign: 'left',
                                                        ':hover': {
                                                            cursor: 'pointer',
                                                            color: this.props.colors.active,
                                                        },
                                                    }}
                                                    onClick={() => {
                                                        element.onTitleClick(this.props.dispatch);
                                                    }}
                                                >{element.title}</button>
                                            ) : (
                                                <p
                                                    key={`p-${index}-${element.id}`}
                                                    style={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        backgroundColor: this.props.colors.sideBackground,
                                                        color: element.color,
                                                        fontSize: '14px',
                                                        height: '16px',
                                                        lineHeight: '16px',
                                                        marginTop: 0,
                                                        marginRight: 0,
                                                        marginBottom: '6px',
                                                        marginLeft: 0,
                                                        padding: 0,
                                                        textAlign: 'left',
                                                    }}
                                                >{element.title}</p>
                                            )}
                                            <p style={{
                                                fontSize: '14px',
                                                height: '16px',
                                                lineHeight: '16px',
                                                color: this.props.colors.secondaryContent,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                margin: 0,
                                            }}>{element.subtitle}</p>
                                        </div>
                                    </li>
                                ))}</ul>
                            )}
                            colors={this.props.colors}
                        />
                    </div>
                </div>
            </div>
        )
    }

    componentWillUnmount() {
        window.clearInterval(this.interval);
    }
}

function scholarRequestToRequest(scholarRequest, state, fetching, blocked) {
    return {
        id: `${scholarRequest.doi}-${scholarRequest.url}-${state.version}-scholar-request`,
        title: state.publications.has(scholarRequest.doi) ? state.publications.get(scholarRequest.doi).title : 'Request cancelled',
        onTitleClick: (state.publications.has(scholarRequest.doi) ?
            (
                dispatch => {
                    if (state.publications.get(scholarRequest.doi).selected) {
                        dispatch(unselectPublication());
                    } else {
                        dispatch(selectPublication(scholarRequest.doi));
                    }
                }
            )
            : null
        ),
        subtitle: scholarRequest.type === SCHOLAR_REQUEST_TYPE_INITIALIZE ? 'Initial request' : `${scholarRequest.number} / ${scholarRequest.total}`,
        color: (state.publications.has(scholarRequest.doi) ?
            (state.publications.get(scholarRequest.doi).selected ? state.colors.active : state.colors.link)
            : state.colors.error
        ),
        borderColor: (blocked ?
            state.colors.error
            : (fetching ?
                state.colors.active
                : state.colors.link
            )
        ),
    };
}

function crossrefRequestToRequest(crossrefRequest, state, fetching) {
    switch (crossrefRequest.type) {
        case CROSSREF_REQUEST_TYPE_VALIDATION:
            return {
                id: `${crossrefRequest.doi}-${state.version}-publication`,
                title: crossrefRequest.doi,
                onTitleClick: null,
                subtitle: 'Validation',
                color: state.colors.content,
                borderColor: (!state.connected ?
                    state.colors.error
                    : (fetching ?
                        state.colors.active
                        : state.colors.link
                    )
                ),
            };
        case CROSSREF_REQUEST_TYPE_CITER_METADATA:
        case CROSSREF_REQUEST_TYPE_IMPORTED_METADATA:
            return {
                id: `${crossrefRequest.title}-${state.version}-crossref-request`,
                title: (crossrefRequest.type === CROSSREF_REQUEST_TYPE_CITER_METADATA ?
                    state.publications.get(crossrefRequest.parentDoi).title
                    : crossrefRequest.title
                ),
                onTitleClick: (crossrefRequest.type === CROSSREF_REQUEST_TYPE_CITER_METADATA ?
                    (dispatch => {
                        if (state.publications.get(crossrefRequest.parentDoi).selected) {
                            dispatch(unselectPublication());
                        } else {
                            dispatch(selectPublication(crossrefRequest.parentDoi));
                        }
                    })
                    : null
                ),
                subtitle: (crossrefRequest.type === CROSSREF_REQUEST_TYPE_CITER_METADATA ?
                    `DOI for “${crossrefRequest.title}”`
                    : 'Validation'
                ),
                color: (crossrefRequest.type === CROSSREF_REQUEST_TYPE_CITER_METADATA ?
                    state.publications.get(crossrefRequest.parentDoi).selected ? state.colors.active : state.colors.link
                    : null
                ),
                borderColor: (!state.connected ?
                    state.colors.error
                    : (fetching ?
                        state.colors.active
                        : state.colors.link
                    )
                ),
            };
        default:
            throw new Error(`Unknown Crossref request type '${crossrefRequest.type}'`);
    }
}

function doiRequestToRequest(doiRequest, state, fetching) {
    return {
        id: `${doiRequest.id}-${state.version}-doi-request`,
        title: state.publications.get(doiRequest.doi).title,
        onTitleClick: dispatch => {
            if (state.publications.get(doiRequest.doi).selected) {
                dispatch(unselectPublication());
            } else {
                dispatch(selectPublication(doiRequest.doi));
            }
        },
        subtitle: `BibTeX for “${doiRequest.doi}”`,
        color: state.publications.get(doiRequest.doi).selected ? state.colors.active : state.colors.link,
        borderColor: (!state.connected ?
            state.colors.error
            : (fetching ?
                state.colors.active
                : state.colors.link
            )
        ),
    };
}

export default connect(
    state => {
        const blocked = (
            !state.connected
            || state.scholar.status === SCHOLAR_STATUS_BLOCKED_VISIBLE
            || state.scholar.status === SCHOLAR_STATUS_BLOCKED_HIDDEN
        );
        return {
            requests: [
                ...(state.scholar.requests.length > 0 ?
                    [scholarRequestToRequest(state.scholar.requests[0], state, state.scholar.status === scholarQueue.status.FETCHING, blocked)]
                    : []
                ),
                ...(state.crossref.status === crossrefQueue.status.FETCHING ?
                    [crossrefRequestToRequest(state.crossref.requests[0], state, true)]
                    : []
                ),
                ...(state.doi.status === doiQueue.status.FETCHING ?
                    [doiRequestToRequest(state.doi.requests[0], state, true)]
                    : []
                ),
                ...state.scholar.requests.slice(1).map(scholarRequest => scholarRequestToRequest(scholarRequest, state, false, blocked)),
                ...(state.crossref.status === crossrefQueue.status.FETCHING ?
                    state.crossref.requests.slice(1)
                    : state.crossref.requests
                ).map(crossrefRequest => crossrefRequestToRequest(crossrefRequest, state, false)),
                ...(state.doi.status === doiQueue.status.FETCHING ?
                    state.doi.requests.slice(1)
                    : state.doi.requests
                ).map(doiRequest => doiRequestToRequest(doiRequest, state)),
            ],
            hasPages: state.scholar.requests.length > 0,
            beginOfRefractoryPeriod: state.scholar.beginOfRefractoryPeriod,
            endOfRefractoryPeriod: state.scholar.endOfRefractoryPeriod,
            blocked,
            scholarStatus: state.scholar.status,
            connected: state.connected,
            colors: state.colors,
        };
    }
)(Radium(Requests));
