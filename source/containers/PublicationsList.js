import React from 'react'
import Radium from 'radium'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import List from '../components/List'
import {
    isOlderThan,
    selectPublication,
    unselectPublication,
    pad,
} from '../actions/managePublication'
import {
    PUBLICATION_STATUS_UNVALIDATED,
    PUBLICATION_STATUS_DEFAULT,
    PUBLICATION_STATUS_IN_COLLECTION,
} from '../constants/enums'

class PublicationsList extends React.Component {

    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        zIndex: PropTypes.string.isRequired,
    }

    render() {
        return (
            <div style={{
                width: `${this.props.width}px`,
                height: `${this.props.height}px`,
                position: 'absolute',
                zIndex: this.props.zIndex,
                backgroundColor: this.props.colors.background,
                top: 0,
                left: 0,
                overflow: 'scroll',
            }}>
                <List
                    elementsPerPage={20}
                    elements={this.props.publications}
                    emptyContent={(<div />)}
                    pageFromElements={(elements, list) => (
                        <ul style={{
                            listStyleType: 'none',
                            margin: 0,
                            padding: 0,
                        }}>{elements.map((element, index) => (
                            <li
                                key={`${index}-${element.doi}`}
                                style={{
                                    width: '100%',
                                    height: '50px',
                                    padding: '6px',
                                    backgroundColor: (element.selected ?
                                        this.props.colors.active
                                        : (element.isCiting ?
                                            this.props.colors.valid
                                            : (element.isCited ?
                                                this.props.colors.warning
                                                : (element.status === PUBLICATION_STATUS_IN_COLLECTION ?
                                                    this.props.colors.link
                                                    : this.props.colors.backgroundColor
                                                )
                                            )
                                        )
                                    ),
                                    borderBottom: `1px solid ${this.props.colors.sideSeparator}`,
                                    cursor: 'pointer',
                                    ':hover': {
                                        backgroundColor: this.props.colors.active,
                                    },
                                }}
                                onClick={() => {
                                    if (element.selected) {
                                        this.props.dispatch(unselectPublication());
                                    } else {
                                        this.props.dispatch(selectPublication(element.doi));
                                    }
                                }}
                            >
                                <div style={{
                                    color: (
                                        element.selected
                                        || element.isCited
                                        || element.isCiting
                                        || element.status === PUBLICATION_STATUS_IN_COLLECTION
                                        || Radium.getState(list.state, `${index}-${element.doi}`, ':hover')
                                    ) ? this.props.colors.background : this.props.colors.content,
                                    fontSize: '14px',
                                    height: '16px',
                                    lineHeight: '16px',
                                    marginBottom: '6px',
                                    fontFamily: 'roboto',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}>
                                    <span>
                                        {element.date.map(part => pad(part)).join('-')}
                                    </span>
                                    <span>{'\u00a0\u00a0'}—{'\u00a0\u00a0'}</span>
                                    <span>
                                        {element.title}
                                    </span>
                                </div>
                                <div style={{
                                    color: (
                                        element.selected
                                        || element.isCited
                                        || element.isCiting
                                        || element.status === PUBLICATION_STATUS_IN_COLLECTION
                                        || Radium.getState(list.state, `${index}-${element.doi}`, ':hover')
                                    ) ? this.props.colors.background : this.props.colors.content,
                                    fontSize: '14px',
                                    height: '16px',
                                    lineHeight: '16px',
                                    fontFamily: 'robotoLight',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}>
                                    <span style={{
                                        fontStyle: 'italic',
                                    }}>
                                        {element.journal}
                                    </span>
                                    <span>{'\u00a0\u00a0'}—{'\u00a0\u00a0'}</span>
                                    <span>
                                        {element.authors.join(', ')}
                                    </span>
                                </div>
                            </li>
                        ))}</ul>
                    )}
                    colors={this.props.colors}
                />
            </div>
        )
    }
}

export default connect(
    state => {
        const citersCountByDoi = new Map();
        for (let [doi, publication] of state.publications.entries()) {
            for (let citer of publication.citers) {
                if (state.publications.get(citer).status === PUBLICATION_STATUS_DEFAULT) {
                    if (citersCountByDoi.has(citer)) {
                        citersCountByDoi.set(citer, citersCountByDoi.get(citer) + 1);
                    } else {
                        citersCountByDoi.set(citer, 1);
                    }
                }
            }
        }
        const recommandedDois = new Set(Array.from(citersCountByDoi.entries()).filter(
            ([doi, count]) => count >= state.graph.threshold
        ).map(
            ([doi, count]) => doi
        ));
        const selectedDoiAndPublication = Array.from(state.publications.entries()).find(([doi, publication]) => publication.selected);
        const doisCitingSelected = new Set(selectedDoiAndPublication ? selectedDoiAndPublication[1].citers : []);
        const doisCitedBySelected = new Set(selectedDoiAndPublication ?
            Array.from(state.publications.entries()).filter(
                ([doi, publication]) => publication.citers.includes(selectedDoiAndPublication[0])
            ).map(
                ([doi, publication]) => doi
            )
            : []
        );
        const publications = Array.from(state.publications.entries()).filter(
            ([doi, publication]) => publication.status === PUBLICATION_STATUS_IN_COLLECTION || recommandedDois.has(doi)
        ).map(
            ([doi, publication]) => {return {
                ...publication,
                doi,
                isCiting: doisCitingSelected.has(doi),
                isCited: doisCitedBySelected.has(doi),
            }}
        ).sort(
            (firstPublication, secondPublication) => {
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
            }
        );
        return {
            publications,
            recommandedDois,
            colors: state.colors,
        };
    }
)(Radium(PublicationsList));
