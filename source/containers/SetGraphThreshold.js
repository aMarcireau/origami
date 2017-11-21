import React from 'react'
import Radium from 'radium'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import HorizontallyMovable from './HorizontallyMovable'
import {setGraphThreshold} from '../actions/manageGraph'
import {
    acquireMouse,
    releaseMouse,
} from '../actions/manageMouse'
import {
    PUBLICATION_STATUS_UNVALIDATED,
    PUBLICATION_STATUS_DEFAULT,
    PUBLICATION_STATUS_IN_COLLECTION,
} from '../constants/enums'

class SetGraphThreshold extends React.Component {

    static propTypes = {
        left: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        threshold: PropTypes.number.isRequired,
        thresholdLimit: PropTypes.number.isRequired,
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
                    width: `${this.props.width + 10}px`,
                    position: 'absolute',
                    top: '18.5px',
                    left: '-5px',
                    backgroundColor: this.props.colors.sideSeparator,
                }} />
                <div style={{
                    height: '2px',
                    position: 'absolute',
                    top: '17.5px',
                    left: `${((this.props.threshold - 1) / (this.props.thresholdLimit - 1)) * this.props.width + 5}px`,
                    width: `${(1 - ((this.props.threshold - 1) / (this.props.thresholdLimit - 1))) * this.props.width}px`,
                    backgroundColor: this.props.colors.link,
                }} />
                <svg
                    style={{
                        position: 'absolute',
                        left: `${((this.props.threshold - 1) / (this.props.thresholdLimit - 1)) * this.props.width - 5}px`,
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
                            fill: this.props.mouseOwner === 'SetGraphThresholdHorizontallyMovable' ? this.props.colors.active : this.props.colors.link,
                        }}
                    />
                </svg>
                <div style={{
                    position: 'absolute',
                    width: '50px',
                    top: '39px',
                    left: `${((this.props.threshold - 1) / (this.props.thresholdLimit - 1)) * this.props.width - 25}px`,
                    zIndex: '40',
                    textAlign: 'center',
                    visibility: this.props.mouseOwner === 'SetGraphThresholdHorizontallyMovable' ? 'visible' : 'hidden',
                    opacity: this.props.mouseOwner === 'SetGraphThresholdHorizontallyMovable' ? 1 : 0,
                }}>
                    <div style={{
                        display: 'inline-block',
                        backgroundColor: this.props.colors.active,
                        color: this.props.colors.background,
                        padding: '5px',
                        fontFamily: 'roboto',
                        fontSize: '14px',
                        borderRadius: '10px',
                    }}>
                        {this.props.threshold === this.props.thresholdLimit ? '∞' : this.props.threshold}
                    </div>
                </div>
                <HorizontallyMovable
                    id='SetGraphThresholdHorizontallyMovable'
                    leftLimit={this.props.left}
                    position={this.props.left + ((this.props.threshold - 1) / (this.props.thresholdLimit - 1)) * this.props.width}
                    rightLimit={this.props.left + this.props.width + 1}
                    move={position => {
                        const newGraphThreshold = Math.round((position - this.props.left) / this.props.width * (this.props.thresholdLimit - 1) + 1);
                        if (newGraphThreshold !== this.props.threshold) {
                            this.props.dispatch(setGraphThreshold(newGraphThreshold));
                        }
                    }}
                    style={{
                        width: '10px',
                        height: '20px',
                        position: 'absolute',
                        left: `${((this.props.threshold - 1) / (this.props.thresholdLimit - 1)) * this.props.width - 5}px`,
                        top: '10.5px',
                    }}
                />
            </div>
        )
    }
}

export default connect(
    state => {
        const citersCountByDoi = new Map();
        for (const [doi, publication] of state.publications.entries()) {
            if (publication.status === PUBLICATION_STATUS_IN_COLLECTION) {
                for (const citer of publication.citers) {
                    if (state.publications.get(citer).status === PUBLICATION_STATUS_DEFAULT) {
                        if (citersCountByDoi.has(citer)) {
                            citersCountByDoi.set(citer, citersCountByDoi.get(citer) + 1);
                        } else {
                            citersCountByDoi.set(citer, 1);
                        }
                    }
                }
            }
        }
        const thresholdLimit = citersCountByDoi.size > 0 ? Math.max(...citersCountByDoi.values()) + 1 : 2;
        return {
            threshold: Math.min(state.graph.threshold, thresholdLimit),
            thresholdLimit,
            mouseOwner: state.mouseOwner,
            colors: state.colors,
        }
    }
)(Radium(SetGraphThreshold));
