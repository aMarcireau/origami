import React from 'react'
import Radium from 'radium'
import PropTypes from 'prop-types'

class List extends React.Component {

    static propTypes = {
        elementsPerPage: PropTypes.number.isRequired,
        elements: PropTypes.array.isRequired,
        pageFromElements: PropTypes.func.isRequired,
        emptyContent: PropTypes.node.isRequired,
        colors: PropTypes.object.isRequired,
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
                backgroundColor: this.props.colors.background,
                borderBottom: `1px solid ${this.props.colors.sideSeparator}`,
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
                                color: (this.state.activePage !== 1 ? this.props.colors.active : this.props.colors.secondaryContent),
                            },
                        },
                        (this.state.activePage !== 1 ? {
                            cursor: 'pointer',
                            color: this.props.colors.link,
                        } : {
                            cursor: 'default',
                            color: this.props.colors.secondaryContent,
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
                                        this.props.colors.secondaryContent
                                        : (value === this.state.activePage ? this.props.colors.active : this.props.colors.link)
                                    ),
                                    ':hover': {
                                        color: (value === this.state.activePage ?
                                            this.props.colors.active
                                            : (value === '…' ? this.props.colors.secondaryContent : this.props.colors.active)
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
                                color: (this.state.activePage !== numberOfPages ? this.props.colors.active : this.props.colors.secondaryContent),
                            },
                        },
                        (this.state.activePage !== numberOfPages ? {
                            cursor: 'pointer',
                            color: this.props.colors.link,
                        } : {
                            cursor: 'default',
                            color: this.props.colors.secondaryContent,
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
