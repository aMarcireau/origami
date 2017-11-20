import React from 'react'
import Radium from 'radium'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {
    SIDE_SEPARATOR_COLOR,
    LINK_COLOR,
    ACTIVE_COLOR,
} from '../constants/styles'

class DisplayMenu extends React.Component {
    render() {
        return (
            <div style={{
                color: LINK_COLOR,
                display: 'inline-block',
                height: '39px',
                lineHeight: '39px',
                fontSize: '14px',
                fontFamily: 'roboto',
                textAlign: 'center',
                position: 'absolute',
                left: '83px',
                paddingLeft: '10px',
                paddingRight: '10px',
                borderRight: `1px solid ${SIDE_SEPARATOR_COLOR}`,
                cursor: 'pointer',
                ':hover': {
                    color: ACTIVE_COLOR,
                }
            }}>Display</div>
        )
    }
}

export default connect()(Radium(DisplayMenu));
