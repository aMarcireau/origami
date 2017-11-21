import React from 'react'
import Radium from 'radium'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import Recaptcha from './Recaptcha'
import {
    selectPublication,
    unselectPublication,
} from '../actions/managePublication'
import {
    changeRecaptchaVisibility,
} from '../actions/manageScholarPage'
import List from '../components/List'
import ProgressBar from '../components/ProgressBar'
import {
    PUBLICATION_STATUS_UNVALIDATED,
    PUBLICATION_STATUS_DEFAULT,
    PUBLICATION_STATUS_IN_COLLECTION,
    PAGE_TYPE_INITIALIZE,
    PAGE_TYPE_CITERS,
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
                                backgroundColor: this.props.colors.sideBackground,
                                color: this.props.colors.link,
                                fontSize: '14px',
                                marginTop: 0,
                                marginRight: 0,
                                marginBottom: '6px',
                                marginLeft: 0,
                                padding: 0,
                                textAlign: 'center',
                                ':hover': {
                                    cursor: 'pointer',
                                    color: this.props.colors.active,
                                },
                                borderTop: 'none',
                                borderRight: 'none',
                                borderBottom: `solid 1px ${this.props.colors.sideSeparator}`,
                                borderLeft: 'none',
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
                        overflowY: 'scroll',
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

export default connect(
    state => {
        const blocked = (
            !state.connected
            || state.scholar.status === SCHOLAR_STATUS_BLOCKED_VISIBLE
            || state.scholar.status === SCHOLAR_STATUS_BLOCKED_HIDDEN
        );
        return {
            requests: [
                ...state.scholar.pages.map((page, index) => {
                    return {
                        id: `${page.doi}-${page.url}-${state.version}-page`,
                        title: state.publications.has(page.doi) ? state.publications.get(page.doi).title : 'Request cancelled',
                        onTitleClick: (state.publications.has(page.doi) ?
                            (
                                dispatch => {
                                    if (state.publications.get(page.doi).selected) {
                                        dispatch(unselectPublication());
                                    } else {
                                        dispatch(selectPublication(page.doi));
                                    }
                                }
                            )
                            : null
                        ),
                        subtitle: page.type === PAGE_TYPE_INITIALIZE ? 'Initial request' : `${page.number} / ${page.total}`,
                        color: (state.publications.has(page.doi) ?
                            (state.publications.get(page.doi).selected ? this.props.colors.active : this.props.colors.link)
                            : this.props.colors.error
                        ),
                        borderColor: (blocked ?
                            this.props.colors.error
                            : (index === 0 && state.scholar.status === SCHOLAR_STATUS_FETCHING ?
                                this.props.colors.active
                                : this.props.colors.link
                            )
                        ),
                    };
                }),
                ...Array.from(state.publications.entries()).filter(([doi, publication]) =>
                    publication.status === PUBLICATION_STATUS_UNVALIDATED
                ).map(([doi, publication]) => {
                    return {
                        id: `${doi}-${state.version}-publication`,
                        title: doi,
                        onTitleClick: null,
                        subtitle: 'Validation',
                        color: this.props.colors.content,
                        borderColor: (!state.connected ?
                            this.props.colors.error
                            : (publication.validating ?
                                this.props.colors.active
                                : this.props.colors.link
                            )
                        ),
                    };
                }),
                ...Array.from(state.bibtexRequests.entries()).map(([id, bibtexRequest]) => {
                    return {
                        id: `${id}-${state.version}-bibtex-request`,
                        title: state.publications.get(bibtexRequest.doi).title,
                        onTitleClick: dispatch => {
                            if (state.publications.get(bibtexRequest.doi).selected) {
                                dispatch(unselectPublication());
                            } else {
                                dispatch(selectPublication(bibtexRequest.doi));
                            }
                        },
                        subtitle: `BibTeX for “${bibtexRequest.doi}”`,
                        color: state.publications.get(bibtexRequest.doi).selected ? this.props.colors.active : this.props.colors.link,
                        borderColor: (!state.connected ?
                            this.props.colors.error
                            : (bibtexRequest.fetching ?
                                this.props.colors.active
                                : this.props.colors.link
                            )
                        ),
                    };
                }),
                ...Array.from(state.doiRequests.entries()).map(([id, doiRequest]) => {
                    return {
                        id: `${id}-${state.version}-doi-request`,
                        title: state.publications.get(doiRequest.parentDoi).title,
                        onTitleClick: dispatch => {
                            if (state.publications.get(doiRequest.parentDoi).selected) {
                                dispatch(unselectPublication());
                            } else {
                                dispatch(selectPublication(doiRequest.parentDoi));
                            }
                        },
                        subtitle: `DOI for “${doiRequest.title}”`,
                        color: state.publications.get(doiRequest.parentDoi).selected ? this.props.colors.active : this.props.colors.link,
                        borderColor: (!state.connected ?
                            this.props.colors.error
                            : (doiRequest.fetching ?
                                this.props.colors.active
                                : this.props.colors.link
                            )
                        ),
                    };
                }),
            ],
            hasPages: state.scholar.pages.length > 0,
            beginOfRefractoryPeriod: state.scholar.beginOfRefractoryPeriod,
            endOfRefractoryPeriod: state.scholar.endOfRefractoryPeriod,
            blocked,
            scholarStatus: state.scholar.status,
            connected: state.connected,
            colors: state.colors,
        };
    }
)(Radium(Requests));
