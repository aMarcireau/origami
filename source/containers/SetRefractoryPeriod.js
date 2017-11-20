import React from 'react'
import Radium from 'radium'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import HorizontallyMovable from './HorizontallyMovable'
import {setPageRefractoryPeriod} from '../actions/manageScholarPage'
import {
    acquireMouse,
    releaseMouse,
} from '../actions/manageMouse'
import {
    SIDE_SEPARATOR_COLOR,
    LINK_COLOR,
    ACTIVE_COLOR,
} from '../constants/styles'

class SetRefractoryPeriod extends React.Component {

    static propTypes = {
        left: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        minimumRefractoryPeriod: PropTypes.number.isRequired,
        maximumRefractoryPeriod: PropTypes.number.isRequired,
        refractoryPeriodLimit: PropTypes.number.isRequired,
    }

    render() {
        return (
            <div style={{
                position: 'absolute',
                left: `${this.props.left}px`,
                top: 0,
                height: '39px',
                width: `${this.props.width}px`,
            }}>
                <div style={{
                    height: '2px',
                    width: `${this.props.width + 20}px`,
                    position: 'absolute',
                    top: '18.5px',
                    left: '-10px',
                    backgroundColor: SIDE_SEPARATOR_COLOR,
                }} />
                <div style={{
                    height: '2px',
                    position: 'absolute',
                    top: '17.5px',
                    left: `${(this.props.minimumRefractoryPeriod / this.props.refractoryPeriodLimit) * this.props.width}px`,
                    width: `${(this.props.maximumRefractoryPeriod - this.props.minimumRefractoryPeriod) / this.props.refractoryPeriodLimit * this.props.width}px`,
                    backgroundColor: LINK_COLOR,
                }} />
                <svg
                    style={{
                        position: 'absolute',
                        left: `${(this.props.minimumRefractoryPeriod / this.props.refractoryPeriodLimit) * this.props.width - 10}px`,
                        top: '10.5px',
                    }}
                    width='10px'
                    height='20px'
                    viewBox='0 0 10 20'
                >
                    <polygon
                        key='minimumRefractoryPeriod'
                        points='0 0 0 10 10 20 10 0'
                        style={{
                            fill: this.props.mouseOwner === 'SetRefractoryPeriodLeftSideHorizontallyMovable' ? ACTIVE_COLOR : LINK_COLOR,
                        }}
                    />
                </svg>
                <div style={{
                    position: 'absolute',
                    width: '50px',
                    top: '39px',
                    left: `${(this.props.minimumRefractoryPeriod / this.props.refractoryPeriodLimit) * this.props.width - 25}px`,
                    zIndex: '40',
                    textAlign: 'center',
                    visibility: this.props.mouseOwner === 'SetRefractoryPeriodLeftSideHorizontallyMovable' ? 'visible' : 'hidden',
                    opacity: this.props.mouseOwner === 'SetRefractoryPeriodLeftSideHorizontallyMovable' ? 1 : 0,
                }}>
                    <div style={{
                        display: 'inline-block',
                        backgroundColor: ACTIVE_COLOR,
                        color: 'white',
                        padding: '5px',
                        fontFamily: 'roboto',
                        fontSize: '14px',
                        borderRadius: '10px',
                    }}>
                        {`${(this.props.minimumRefractoryPeriod / 1000).toFixed(1)} s`}
                    </div>
                </div>
                <div style={{
                    position: 'absolute',
                    width: '50px',
                    top: '39px',
                    left: `${(this.props.maximumRefractoryPeriod / this.props.refractoryPeriodLimit) * this.props.width - 25}px`,
                    zIndex: '40',
                    textAlign: 'center',
                    visibility: this.props.mouseOwner === 'SetRefractoryPeriodRightSideHorizontallyMovable' ? 'visible' : 'hidden',
                    opacity: this.props.mouseOwner === 'SetRefractoryPeriodRightSideHorizontallyMovable' ? 1 : 0,
                }}>
                    <div style={{
                        display: 'inline-block',
                        backgroundColor: ACTIVE_COLOR,
                        color: 'white',
                        padding: '5px',
                        fontFamily: 'roboto',
                        fontSize: '14px',
                        borderRadius: '10px',
                    }}>
                        {`${(this.props.maximumRefractoryPeriod / 1000).toFixed(1)} s`}
                    </div>
                </div>
                <svg
                    style={{
                        position: 'absolute',
                        left: `${(this.props.maximumRefractoryPeriod / this.props.refractoryPeriodLimit) * this.props.width}px`,
                        top: '10.5px',
                    }}
                    width='10px'
                    height='20px'
                    viewBox='0 0 10 20'
                >
                    <polygon
                        key='maximumRefractoryPeriod'
                        points='0 0 0 20 10 10 10 0'
                        style={{
                            fill: this.props.mouseOwner === 'SetRefractoryPeriodRightSideHorizontallyMovable' ? ACTIVE_COLOR : LINK_COLOR,
                        }}
                    />
                </svg>
                <HorizontallyMovable
                    id='SetRefractoryPeriodLeftSideHorizontallyMovable'
                    leftLimit={this.props.left}
                    position={this.props.left + (this.props.minimumRefractoryPeriod / this.props.refractoryPeriodLimit) * this.props.width}
                    rightLimit={this.props.left + (this.props.maximumRefractoryPeriod / this.props.refractoryPeriodLimit) * this.props.width + 1}
                    move={position => {
                        this.props.dispatch(setPageRefractoryPeriod(
                            (position - this.props.left) / this.props.width * this.props.refractoryPeriodLimit,
                            this.props.maximumRefractoryPeriod
                        ));
                    }}
                    style={{
                        width: '10px',
                        height: '20px',
                        position: 'absolute',
                        left: `${(this.props.minimumRefractoryPeriod / this.props.refractoryPeriodLimit) * this.props.width - 10}px`,
                        top: '10.5px',
                    }}
                />
                <HorizontallyMovable
                    id='SetRefractoryPeriodRightSideHorizontallyMovable'
                    leftLimit={this.props.left + (this.props.minimumRefractoryPeriod / this.props.refractoryPeriodLimit) * this.props.width}
                    position={this.props.left + (this.props.maximumRefractoryPeriod / this.props.refractoryPeriodLimit) * this.props.width}
                    rightLimit={this.props.left + this.props.width + 1}
                    move={position => {
                        this.props.dispatch(setPageRefractoryPeriod(
                            this.props.minimumRefractoryPeriod,
                            (position - this.props.left) / this.props.width * this.props.refractoryPeriodLimit
                        ));
                    }}
                    style={{
                        width: '10px',
                        height: '20px',
                        position: 'absolute',
                        left: `${(this.props.maximumRefractoryPeriod / this.props.refractoryPeriodLimit) * this.props.width}px`,
                        top: '10.5px',
                    }}
                />
            </div>
        )
    }
}

export default connect(
    state => {
        return {
            minimumRefractoryPeriod: state.scholar.minimumRefractoryPeriod,
            maximumRefractoryPeriod: state.scholar.maximumRefractoryPeriod,
            mouseOwner: state.mouseOwner,
        }
    }
)(Radium(SetRefractoryPeriod));
