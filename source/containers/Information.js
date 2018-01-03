import {shell} from 'electron'
import React from 'react'
import Radium from 'radium'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import ConfirmationButton from '../components/ConfirmationButton'
import List from '../components/List'
import {
    isOlderThan,
    pad,
} from '../libraries/utilities'
import {
    addPublicationToCollection,
    selectPublication,
    updatePublication,
    updateAllPublications,
    removePublication,
    setPublicationTag,
} from '../actions/managePublication'
import {
    PUBLICATION_STATUS_UNVALIDATED,
    PUBLICATION_STATUS_DEFAULT,
    PUBLICATION_STATUS_IN_COLLECTION,
    SCHOLAR_REQUEST_TYPE_INITIALIZE,
    SCHOLAR_REQUEST_TYPE_CITERS,
    CROSSREF_REQUEST_TYPE_VALIDATION,
    CROSSREF_REQUEST_TYPE_CITER_METADATA,
    CROSSREF_REQUEST_TYPE_IMPORTED_METADATA,
} from '../constants/enums'

class Information extends React.Component {

    static propTypes = {
        style: PropTypes.object,
    }

    render() {
        return (this.props.publication ? (
            <div style={this.props.style}>
                <h1 style={{
                    color: this.props.colors.content,
                    fontSize: '14px',
                    fontFamily: 'roboto',
                    margin: 0,
                    paddingTop: '10px',
                    paddingRight: '6px',
                    paddingBottom: 0,
                    paddingLeft: '6px',
                    textAlign: 'left',
                    userSelect: 'text',
                }}>{this.props.publication.title}</h1>
                <p style={{
                    color: this.props.colors.content,
                    fontSize: '14px',
                    fontFamily: 'robotoLight',
                    margin: 0,
                    paddingTop: '10px',
                    paddingRight: '6px',
                    paddingBottom: 0,
                    paddingLeft: '6px',
                    textAlign: 'left',
                    userSelect: 'text',
                }}>{this.props.publication.authors.join(', ')}</p>
                <p style={{
                    color: this.props.colors.content,
                    fontSize: '14px',
                    fontFamily: 'robotoLight',
                    fontStyle: 'italic',
                    margin: 0,
                    paddingTop: '10px',
                    paddingRight: '6px',
                    paddingBottom: 0,
                    paddingLeft: '6px',
                    textAlign: 'left',
                    userSelect: 'text',
                }}>{this.props.publication.journal}</p>
                <p style={{
                    color: this.props.colors.content,
                    fontSize: '14px',
                    fontFamily: 'robotoLight',
                    margin: 0,
                    paddingTop: '10px',
                    paddingRight: '6px',
                    paddingBottom: 0,
                    paddingLeft: '6px',
                    textAlign: 'left',
                    userSelect: 'text',
                }}>{this.props.publication.date.map(part => pad(part)).join('-')}</p>
                <div style={{
                    width: '100%',
                    borderBottom: `solid 1px ${this.props.colors.sideSeparator}`,
                }}>
                    <button
                        style={{
                            textDecoration: 'none',
                            paddingTop: '10px',
                            paddingRight: '6px',
                            paddingBottom: '10px',
                            paddingLeft: '6px',
                            border: 'none',
                            display: 'inline-block',
                            textAlign: 'left',
                            outline: 'none',
                            fontSize: '14px',
                            fontFamily: 'robotoLight',
                            color: this.props.colors.link,
                            backgroundColor: this.props.colors.sideBackground,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '100%',
                            userSelect: 'text',
                            ':hover': {
                                cursor: 'pointer',
                                color: this.props.colors.active,
                            },
                        }}
                        onClick={() => {
                            shell.openExternal(`https://doi.org/${this.props.doi}`);
                        }}
                    >{this.props.doi}</button>
                </div>
                {this.props.publication.status === PUBLICATION_STATUS_IN_COLLECTION &&
                    <div style={{
                        height: '39px',
                        borderBottom: `solid 1px ${this.props.colors.sideSeparator}`,
                    }}>
                        {new Array(5).fill().map((_, index) => (
                            <div
                                key={`tag-${this.props.publication.updated}-${this.props.doi}-${index}`}
                                style={{
                                    width: '39px',
                                    height: '39px',
                                    display: 'inline-block',
                                    ':hover': {
                                        cursor: 'pointer',
                                    },
                                }}
                                onClick={() => {
                                    this.props.dispatch(setPublicationTag(this.props.doi, this.props.publication.tag === index ? null : index));
                                }}
                            >
                                <svg viewBox='0 0 39 39'>
                                    <circle
                                        fill={this.props.colors[`tag${index}`]}
                                        strokeWidth='1.5'
                                        stroke={(
                                            (this.props.publication.tag === index)
                                            || Radium.getState(
                                                this.state,
                                                `tag-${this.props.publication.updated}-${this.props.doi}-${index}`,
                                                ':hover'
                                            )
                                        ) ? this.props.colors.link : this.props.colors[`tag${index}`]}
                                        cx='19.5'
                                        cy='19.5'
                                        r='8'
                                    />
                                </svg>
                            </div>
                        ))}
                    </div>
                }
                {this.props.publication.citers.length > 0 &&
                    <h2 style={{
                        color: this.props.colors.content,
                        fontSize: '14px',
                        fontFamily: 'roboto',
                        margin: 0,
                        paddingTop: '10px',
                        paddingRight: '6px',
                        paddingBottom: '10px',
                        paddingLeft: '6px',
                        textAlign: 'left',
                        borderBottom: `1px solid ${this.props.colors.sideSeparator}`,
                    }}>{`Cited by ${this.props.publication.citers.length.toString()}${this.props.updatable ? '' : ' (still loading)'}`}</h2>
                }
                {this.props.publication.status === PUBLICATION_STATUS_IN_COLLECTION &&
                    <List
                        elementsPerPage={10}
                        elements={this.props.publication.citers.map(citer => {
                            return {
                                ...this.props.publications.get(citer),
                                doi: citer,
                            };
                        }).sort((firstPublication, secondPublication) => {
                            if (isOlderThan(firstPublication.date, secondPublication.date)) {
                                return 1;
                            } else if (isOlderThan(secondPublication.date, firstPublication.date)) {
                                return -1;
                            }
                            if (firstPublication.date.length < secondPublication.date.length) {
                                return 1;
                            } else if (firstPublication.date.length > secondPublication.date.length) {
                                return -1;
                            }
                            return firstPublication.title.localeCompare(secondPublication.title);
                        })}
                        emptyContent={
                            <div style={{
                                color: this.props.colors.secondaryContent,
                                fontSize: '14px',
                                fontFamily: 'robotoLight',
                                textAlign: 'left',
                                paddingLeft: '6px',
                                paddingRight: '6px',
                                paddingTop: '10px',
                                paddingBottom: '10px',
                                borderBottom: `1px solid ${this.props.colors.sideSeparator}`,
                            }}>{`This publication is not cited ${this.props.updatable ? '' : ' (still loading)'}`}</div>
                        }
                        pageFromElements={(elements, list) => (
                            <ul style={{
                                listStyleType: 'none',
                                margin: 0,
                                padding: 0,
                            }}>{elements.map((element, index) => (
                                <li
                                    key={`${this.props.publication.updated}-${this.props.doi}-${index}-${element.doi}`}
                                    style={{
                                        borderBottom: `solid 1px ${this.props.colors.sideSeparator}`,
                                        height: '50px',
                                        position: 'relative',
                                    }}
                                >
                                    {element.status === PUBLICATION_STATUS_DEFAULT && (
                                        <button
                                            key={`${this.props.publication.updated}-${this.props.doi}-${index}-${element.doi}-add-button`}
                                            style={{
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                width: '40px',
                                                height: '49px',
                                                textDecoration: 'none',
                                                paddingTop: '5px',
                                                paddingRight: 0,
                                                paddingBottom: 0,
                                                paddingLeft: 0,
                                                borderTop: 'none',
                                                borderRight: `1px solid ${this.props.colors.sideSeparator}`,
                                                borderBottom: 'none',
                                                borderLeft: 'none',
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
                                                this.props.dispatch(addPublicationToCollection(
                                                    element.doi,
                                                    new Date().getTime()
                                                ));
                                            }}
                                        >
                                            <svg viewBox="0 0 40 40">
                                                <rect
                                                    style={{
                                                        fill: (Radium.getState(list.state, `${this.props.publication.updated}-${this.props.doi}-${index}-${element.doi}-add-button`, ':hover') ? this.props.colors.valid : this.props.colors.link),
                                                    }}
                                                    x="10"
                                                    y="19"
                                                    width="20"
                                                    height="2"
                                                />
                                                <rect
                                                    style={{
                                                        fill: (Radium.getState(list.state, `${this.props.publication.updated}-${this.props.doi}-${index}-${element.doi}-add-button`, ':hover') ? this.props.colors.valid : this.props.colors.link),
                                                    }}
                                                    x="19"
                                                    y="10"
                                                    width="2"
                                                    height="20"
                                                />
                                            </svg>
                                        </button>
                                    )}
                                    <div style={{
                                        width: element.status === PUBLICATION_STATUS_IN_COLLECTION ? '100%' : 'calc(100% - 40px)',
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        height: '49px',
                                        paddingTop: '6px',
                                        paddingRight: '6px',
                                        paddingBottom: '6px',
                                        paddingLeft: '6px',
                                    }}>
                                        <button
                                            key={`${this.props.publication.updated}-${this.props.doi}-${index}-${element.doi}-title-button`}
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
                                                color: this.props.colors.link,
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
                                                    color: this.props.colors.valid,
                                                },
                                            }}
                                            onClick={() => {
                                                this.props.dispatch(selectPublication(element.doi));
                                            }}
                                        >{element.title}</button>
                                        <p style={{
                                            color: this.props.colors.content,
                                            fontSize: '14px',
                                            height: '16px',
                                            lineHeight: '16px',
                                            fontFamily: 'robotoLight',
                                            margin: 0,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}>{element.authors.join(', ')}</p>
                                    </div>
                                </li>
                            ))}</ul>
                        )}
                        colors={this.props.colors}
                    />
                }
                {this.props.publication.status === PUBLICATION_STATUS_DEFAULT && (
                    <button
                        key={`${this.props.publication.updated}-${this.props.doi}-information-add-button`}
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
                                color: this.props.colors.valid,
                            },
                        }}
                        onClick={() => {
                            this.props.dispatch(addPublicationToCollection(
                                this.props.doi,
                                new Date().getTime()
                            ));
                        }}
                    >Add to collection</button>
                )}
                {this.props.publication.updated != null && (
                    <p style={{
                        color: this.props.colors.content,
                        fontSize: '14px',
                        fontFamily: 'robotoLight',
                        margin: 0,
                        paddingTop: '10px',
                        paddingRight: '6px',
                        paddingBottom: '10px',
                        paddingLeft: '6px',
                        textAlign: 'left',
                        borderBottom: `1px solid ${this.props.colors.sideSeparator}`,
                    }}>{`Last update: ${new Date(this.props.publication.updated).getFullYear()}-${pad(new Date(this.props.publication.updated).getMonth() + 1)}-${pad(new Date(this.props.publication.updated).getDate())}`}</p>
                )}
                {this.props.publication.bibtex != null && (
                    <p style={{
                        color: this.props.colors.content,
                        fontSize: '14px',
                        fontFamily: 'robotoLight',
                        margin: 0,
                        paddingTop: '10px',
                        paddingRight: '6px',
                        paddingBottom: '10px',
                        paddingLeft: '6px',
                        textAlign: 'left',
                        borderBottom: `1px solid ${this.props.colors.sideSeparator}`,
                    }}>BibTeX loaded</p>
                )}
                {this.props.updatable && (
                    <button
                        key={`${this.props.publication.updated}-${this.props.doi}-information-update-button`}
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
                                color: this.props.colors.active,
                            },
                        }}
                        onClick={() => {
                            this.props.dispatch(updatePublication(this.props.doi, new Date().getTime()));
                        }}
                    >Update</button>
                )}
                {this.props.publication.status === PUBLICATION_STATUS_IN_COLLECTION && (
                    <button
                        key={`${this.props.publication.updated}-${this.props.doi}-information-remove-button`}
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
                            this.props.dispatch(removePublication(this.props.doi));
                        }}
                    >Remove from collection</button>
                )}
            </div>
        ) : (
            <div>
                {(this.props.numberOfUpdatableDois > 0) && (
                    <ConfirmationButton
                        numberOfPublications={this.props.numberOfUpdatableDois}
                        onClick={() => {
                            this.props.dispatch(updateAllPublications(new Date().getTime()));
                        }}
                        colors={this.props.colors}
                        componentKey={`${this.props.hash}-information-update-collection-button`}
                    />
                )}
                <div style={{
                    color: this.props.colors.secondaryContent,
                    fontSize: '14px',
                    fontFamily: 'robotoLight',
                    textAlign: 'center',
                    paddingTop: '10px',
                    paddingRight: '10px',
                    paddingLeft: '10px',
                }}>
                    Select a publication to display associated information
                </div>
            </div>
        ))
    }
}

export default connect(
    state => {
        const doiAndPublication = Array.from(state.publications.entries()).find(([doi, publication]) => publication.selected);
        if (!doiAndPublication) {
            const updatableDois = new Set(Array.from(state.publications.entries()).filter(
                ([doi, publication]) => publication.status === PUBLICATION_STATUS_IN_COLLECTION
            ).map(
                ([doi, publication]) => doi
            ));
            for (const scholarRequest of state.scholar.requests) {
                updatableDois.delete(scholarRequest.doi);
            }
            for (const crossrefRequest of state.crossref.requests) {
                if (crossrefRequest.type === CROSSREF_REQUEST_TYPE_CITER_METADATA) {
                    updatableDois.delete(crossrefRequest.parentDoi);
                }
            }
            for (const doiRequest of state.doi.requests) {
                updatableDois.delete(doiRequest.doi);
            }
            return {
                publication: null,
                publications: state.publications,
                numberOfUpdatableDois: updatableDois.size,
                hash: state.tabs.hash,
                colors: state.colors,
            };
        }
        return {
            doi: doiAndPublication[0],
            publication: doiAndPublication[1],
            updatable: (
                doiAndPublication[1].status === PUBLICATION_STATUS_IN_COLLECTION
                && state.scholar.requests.every(
                    request => request.doi !== doiAndPublication[0]
                )
                && state.crossref.requests.every(
                    crossrefRequest => (
                        crossrefRequest.type !== CROSSREF_REQUEST_TYPE_CITER_METADATA
                        || crossrefRequest.parentDoi !== doiAndPublication[0]
                    )
                )
            ),
            publications: state.publications,
            colors: state.colors,
        };
    }
)(Radium(Information));
