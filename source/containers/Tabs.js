import React from 'react'
import Radium from 'radium'
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import {selectInformationTab, selectWarningsTab} from '../actions/selectTab';
import {
    SIDE_SEPARATOR_COLOR,
} from '../constants/styles'

const liStyle = {
    width: '40px',
    height: '40px',
    padding: '4px',
    marginLeft: '10px',
    marginRight: '10px',
};

class Tabs extends React.Component {

    static propTypes = {
        activeIndex: PropTypes.number,
        hash: PropTypes.number,
    }

    render() {
        return (
            <div>
                <ul style={{
                    listStyleType: 'none',
                    display: 'flex',
                    height: '40px',
                    margin: 0,
                    padding: 0,
                    justifyContent: 'center',
                    borderBottom: `solid 1px ${SIDE_SEPARATOR_COLOR}`,
                }}>{this.props.children.map((child, index) => this.props.activeIndex === index ?
                    <li key={`${this.props.hash}-${index}`} style={liStyle}>{child.props.activeIcon}</li>
                    : <li
                        key={`${this.props.hash}-${index}`}
                        onClick={() => {
                            this.props.dispatch(index === 0 ? selectInformationTab() : selectWarningsTab());
                        }}
                        style={[liStyle, {
                            ':hover': {
                                cursor: 'pointer',
                            },
                        }]}
                    >{Radium.getState(this.state, `${this.props.hash}-${index}`, ':hover') ? child.props.activeIcon : child.props.icon}</li>
                )}</ul>
                {this.props.children[this.props.activeIndex]}
            </div>
        )
    }
}

export default connect(
    state => {
        return {
            activeIndex: state.tabs.index,
            hash: state.tabs.hash,
        };
    }
)(Radium(Tabs));
