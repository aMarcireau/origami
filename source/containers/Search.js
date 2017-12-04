import React from 'react'
import Radium from 'radium'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {setSearch} from '../actions/manageSearch'
import List from '../components/List'
import {
    addPublicationToCollection,
    selectPublication,
    isOlderThan,
} from '../actions/managePublication'
import {
    PUBLICATION_STATUS_UNVALIDATED,
    PUBLICATION_STATUS_DEFAULT,
    PUBLICATION_STATUS_IN_COLLECTION,
} from '../constants/enums'

class Search extends React.Component {
    render() {
        return (
            <div style={this.props.style}>
                <input
                    type='text'
                    placeholder='Regex'
                    style={{
                        height: '40px',
                        width: '100%',
                        outline: 'none',
                        paddingTop: 0,
                        paddingRight: '12px',
                        paddingBottom: 0,
                        paddingLeft: '12px',
                        fontSize: '14px',
                        color: this.props.colors.content,
                        backgroundColor: this.props.colors.background,
                        borderTop: 'none',
                        borderRight: 'none',
                        borderBottom: `1px solid ${this.props.colors.sideSeparator}`,
                        borderLeft: 'none',
                    }}
                    value={this.props.search}
                    onChange={event => {
                        this.props.dispatch(setSearch(event.target.value));
                    }}
                />
                <List
                    elementsPerPage={10}
                    elements={this.props.publications}
                    emptyContent={
                        <div style={{
                            color: this.props.colors.secondaryContent,
                            fontSize: '14px',
                            fontFamily: 'robotoLight',
                            textAlign: 'center',
                            paddingTop: '10px',
                            paddingRight: '10px',
                            paddingLeft: '10px',
                        }}>No results found</div>
                    }
                    pageFromElements={(elements, list) => (
                        <ul style={{
                            listStyleType: 'none',
                            margin: 0,
                            padding: 0,
                        }}>{elements.map((element, index) => (
                            <li
                                key={`${this.props.hash}-${index}-${element.doi}`}
                                style={{
                                    borderBottom: `solid 1px ${this.props.colors.sideSeparator}`,
                                    height: '50px',
                                    position: 'relative',
                                }}
                            >
                                {element.status === PUBLICATION_STATUS_DEFAULT && (
                                    <button
                                        key={`${this.props.hash}-${index}-${element.doi}-add-button`}
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
                                            const bytes = new Uint8Array(64);
                                            window.crypto.getRandomValues(bytes);
                                            this.props.dispatch(addPublicationToCollection(
                                                element.doi,
                                                new Date().getTime(),
                                                Array.from(bytes).map(byte => byte.toString(16)).join('')
                                            ));
                                        }}
                                    >
                                        <svg viewBox="0 0 40 40">
                                            <rect
                                                style={{
                                                    fill: (Radium.getState(list.state, `${this.props.hash}-${index}-${element.doi}-add-button`, ':hover') ? this.props.colors.valid : this.props.colors.link),
                                                }}
                                                x="10"
                                                y="19"
                                                width="20"
                                                height="2"
                                            />
                                            <rect
                                                style={{
                                                    fill: (Radium.getState(list.state, `${this.props.hash}-${index}-${element.doi}-add-button`, ':hover') ? this.props.colors.valid : this.props.colors.link),
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
                                        key={`${this.props.hash}-${element.updated}-${index}-${element.doi}-title-button`}
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
            </div>
        )
    }
}

export default connect(
    state => {
        const publications = [];
        if (state.search !== '') {
            try {
                const regex = new RegExp(state.search, 'i');
                for (const [doi, publication] of state.publications.entries()) {
                    if (
                        publication.status !== PUBLICATION_STATUS_UNVALIDATED
                        && (
                            regex.test(publication.title)
                            || regex.test(publication.journal)
                            || publication.authors.some(author => regex.test(author))
                        )
                    ) {
                        publications.push({
                            ...publication,
                            doi,
                        });
                    }
                }
                publications.sort((firstPublication, secondPublication) => {
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
                });
            } catch (error) {
                if (!(error instanceof SyntaxError)) {
                    throw error;
                }
            }
        }
        return {
            search: state.search,
            publications,
            colors: state.colors,
            hash: state.tabs.hash,
        };
    }
)(Radium(Search));
