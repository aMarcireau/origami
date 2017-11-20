import React from 'react'
import Radium from 'radium'
import PropTypes from 'prop-types';

class Tab extends React.PureComponent {

    static propTypes = {
        icon: PropTypes.node.isRequired,
        activeIcon: PropTypes.node.isRequired,
    }

    render() {
        return (this.props.children)
    }
}

export default Radium(Tab);
