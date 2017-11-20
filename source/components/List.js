import React from 'react'
import Radium from 'radium'
import PropTypes from 'prop-types';
import {
    SECONDARY_CONTENT_COLOR,
    SIDE_SEPARATOR_COLOR,
    LINK_COLOR,
    ACTIVE_COLOR,
} from '../constants/styles'

class List extends React.Component {

    static propTypes = {
        elementsPerPage: PropTypes.number.isRequired,
        elements: PropTypes.array.isRequired,
        pageFromElements: PropTypes.func.isRequired,
        emptyContent: PropTypes.node.isRequired,
    }

    constructor() {
        super();
        this.state = {
            activePage: 1,
        };
    }

    componentWillReceiveProps(nextProps) {
        const numberOfPages =  Math.ceil(nextProps.elements.length / nextProps.elementsPerPage);
        if (numberOfPages === 0) {
            this.setState({activePage: 1});
        } else if (this.state.activePage > numberOfPages) {
            this.setState({activePage: numberOfPages});
        }
    }

    navigationBar(id) {
        const numberOfPages =  Math.ceil(this.props.elements.length / this.props.elementsPerPage);
        return (numberOfPages > 1 &&
            <ul style={{
                height: '40px',
                listStyleType: 'none',
                display: 'flex',
                margin: 0,
                padding: 0,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                borderBottom: `1px solid ${SIDE_SEPARATOR_COLOR}`,
            }}>
                <li
                    onClick={() => {
                        if (this.state.activePage > 1) {
                            this.setState({activePage: this.state.activePage - 1});
                        }
                    }}
                    style={[
                        {
                            marginLeft: '3px',
                            fontSize: '12px',
                            ':hover': {
                                color: (this.state.activePage !== 1 ? ACTIVE_COLOR : SECONDARY_CONTENT_COLOR),
                            },
                        },
                        (this.state.activePage !== 1 ? {
                            cursor: 'pointer',
                            color: LINK_COLOR,
                        } : {
                            cursor: 'default',
                            color: SECONDARY_CONTENT_COLOR,
                        }),
                    ]}
                    key={`${id}--1`}
                >&#9664;</li>
                {
                    (() => {
                        if (numberOfPages < 7) {
                            return new Array(numberOfPages).fill().map((_, index) => index + 1);
                        }
                        if (this.state.activePage < 1 + 4) {
                            return [...(new Array(5).fill().map((_, index) => index + 1)), '…', numberOfPages];
                        }
                        if (this.state.activePage > numberOfPages - 4) {
                            return [1, '…', ...(new Array(5).fill().map((_, index) => numberOfPages - 4 + index))];
                        }
                        return [
                            1,
                            '…',
                            this.state.activePage - 1,
                            this.state.activePage,
                            this.state.activePage + 1,
                            '…',
                            numberOfPages,
                        ];
                    })().map((value, index) => (
                        <li
                            key={`${id}-${index}`}
                            onClick={() => {
                                if (value !== '…' && value !== this.state.activePage) {
                                    this.setState({activePage: value});
                                }
                            }}
                            style={[
                                {
                                    marginLeft: '3px',
                                    marginRight: '3px',
                                    fontSize: '14px',
                                    color: (value === '…' ?
                                        SECONDARY_CONTENT_COLOR
                                        : (value === this.state.activePage ? ACTIVE_COLOR : LINK_COLOR)
                                    ),
                                    ':hover': {
                                        color: (value === this.state.activePage ?
                                            ACTIVE_COLOR
                                            : (value === '…' ? SECONDARY_CONTENT_COLOR : ACTIVE_COLOR)
                                        ),
                                    },
                                },
                                (value !== '…' && value !== this.state.activePage ? {
                                    cursor: 'pointer',
                                } : {
                                    cursor: 'default',
                                }),
                            ]}
                        >{value}</li>
                    ))
                }
                <li
                    onClick={() => {
                        if (this.state.activePage < numberOfPages) {
                            this.setState({activePage: this.state.activePage + 1});
                        }
                    }}
                    style={[
                        {
                            marginLeft: '3px',
                            fontSize: '12px',
                            ':hover': {
                                color: (this.state.activePage !== numberOfPages ? ACTIVE_COLOR : SECONDARY_CONTENT_COLOR),
                            },
                        },
                        (this.state.activePage !== numberOfPages ? {
                            cursor: 'pointer',
                            color: LINK_COLOR,
                        } : {
                            cursor: 'default',
                            color: SECONDARY_CONTENT_COLOR,
                        }),
                    ]}
                    key={`${id}--2`}
                >&#9654;</li>
            </ul>
        );
    }

    render() {
        const numberOfPages =  Math.ceil(this.props.elements.length / this.props.elementsPerPage);
        return (numberOfPages > 0 ? (
            <div>
                {this.navigationBar('top')}
                {this.props.pageFromElements(this.props.elements.slice(
                    (this.state.activePage - 1) * this.props.elementsPerPage,
                    (this.state.activePage - 1 + 1) * this.props.elementsPerPage,
                ), this)}
                {this.navigationBar('bottom')}
            </div>
        ) : (this.props.emptyContent))
    }
}

export default Radium(List);
