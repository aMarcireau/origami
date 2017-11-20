import React from 'react'
import Radium from 'radium'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import HorizontallyMovable from './HorizontallyMovable'
import {setGraphZoomAndOffset} from '../actions/manageGraph'
import {
    acquireMouse,
    releaseMouse,
} from '../actions/manageMouse'
import {
    SIDE_SEPARATOR_COLOR,
    LINK_COLOR,
    ACTIVE_COLOR,
} from '../constants/styles'

class SetGraphZoom extends React.Component {

    static propTypes = {
        left: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        zoom: PropTypes.number.isRequired,
        zoomMinimum: PropTypes.number.isRequired,
        zoomMaximum: PropTypes.number.isRequired,
    }

    render() {
        return (
            <div style={{
                position: 'absolute',
                left: `${this.props.left}px`,
                height: '39px',
                width: `${this.props.width}px`,
            }}>
                <div style={{
                    height: '2px',
                    width: `${this.props.width + 10}px`,
                    position: 'absolute',
                    top: '18.5px',
                    left: '-5px',
                    backgroundColor: SIDE_SEPARATOR_COLOR,
                }} />
                <svg
                    style={{
                        position: 'absolute',
                        left: `${((this.props.zoom - this.props.zoomMinimum) / (this.props.zoomMaximum - this.props.zoomMinimum)) * this.props.width - 5}px`,
                        top: '10.5px',
                    }}
                    width='10px'
                    height='20px'
                    viewBox='0 0 10 20'
                >
                    <polygon
                        key='minimumRefractoryPeriod'
                        points='0 0 0 10 5 20 10 10 10 0'
                        style={{
                            fill: this.props.mouseOwner === 'SetGraphZoomHorizontallyMovable' ? ACTIVE_COLOR : LINK_COLOR,
                        }}
                    />
                </svg>
                <div style={{
                    position: 'absolute',
                    width: '50px',
                    top: '39px',
                    left: `${((this.props.zoom - this.props.zoomMinimum) / (this.props.zoomMaximum - this.props.zoomMinimum)) * this.props.width - 25}px`,
                    zIndex: '10',
                    textAlign: 'center',
                    visibility: this.props.mouseOwner === 'SetGraphZoomHorizontallyMovable' ? 'visible' : 'hidden',
                    opacity: this.props.mouseOwner === 'SetGraphZoomHorizontallyMovable' ? 1 : 0,
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
                        {`${Math.round(2 ** (this.props.zoom / 20) * 100)} %`}
                    </div>
                </div>
                <HorizontallyMovable
                    id='SetGraphZoomHorizontallyMovable'
                    leftLimit={this.props.left}
                    position={this.props.left + ((this.props.zoom - this.props.zoomMinimum) / (this.props.zoomMaximum - this.props.zoomMinimum)) * this.props.width}
                    rightLimit={this.props.left + this.props.width + 1}
                    move={position => {
                        const newGraphZoom = Math.round((position - this.props.left) / this.props.width * (this.props.zoomMaximum - this.props.zoomMinimum) + this.props.zoomMinimum);
                        if (newGraphZoom !== this.props.zoom) {
                            this.props.dispatch(setGraphZoomAndOffset(
                                newGraphZoom,
                                this.props.xOffset,
                                this.props.yOffset
                            ));
                        }
                    }}
                    style={{
                        width: '10px',
                        height: '20px',
                        position: 'absolute',
                        left: `${((this.props.zoom - this.props.zoomMinimum) / (this.props.zoomMaximum - this.props.zoomMinimum)) * this.props.width - 5}px`,
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
            zoom: state.graph.zoom,
            xOffset: state.graph.xOffset,
            yOffset: state.graph.yOffset,
            mouseOwner: state.mouseOwner,
        }
    }
)(Radium(SetGraphZoom));
