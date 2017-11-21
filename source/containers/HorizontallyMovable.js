import React from 'react'
import Radium from 'radium'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {
    acquireMouse,
    releaseMouse,
} from '../actions/manageMouse'

class HorizontallyMovable extends React.Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        leftLimit: PropTypes.number.isRequired,
        position: PropTypes.number.isRequired,
        rightLimit: PropTypes.number.isRequired,
        move: PropTypes.func.isRequired,
        style: PropTypes.object,
    }

    constructor() {
        super();
        this.state = {
            hover: false,
            active: false,
            targetPosition: 0,
            mouseOffset: 0,
        };
        this.boundOnMouseMove = this.onMouseMove.bind(this);
        this.boundDisable = this.disable.bind(this);
    }

    render() {
        return (
            <div
                style={this.props.style}
                onMouseEnter={this.onMouseEnter.bind(this)}
                onMouseDown={this.onMouseDown.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this)}
            ></div>
        )
    }

    componentDidMount() {
        document.addEventListener('mousemove', this.boundOnMouseMove);
        document.addEventListener('mouseup', this.boundDisable);
        document.body.addEventListener('mouseleave', this.boundDisable);
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.boundOnMouseMove);
        document.removeEventListener('mouseup', this.boundDisable);
        document.body.removeEventListener('mouseleave', this.boundDisable);
    }

    componentDidUpdate(previousProps, previousState) {
        if (this.props.id === this.props.mouseOwner) {
            if (this.state.active) {
                if (this.state.targetPosition < this.props.leftLimit) {
                    document.body.style.cursor = 'e-resize';
                } else if (this.state.targetPosition > this.props.rightLimit) {
                    document.body.style.cursor = 'w-resize';
                } else {
                    document.body.style.cursor = 'col-resize';
                }
            } else if (this.state.hover) {
                document.body.style.cursor = 'col-resize';
            }
        } else if (this.props.mouseOwner === null && this.state.hover) {
            this.props.dispatch(acquireMouse(this.props.id));
        }
    }

    onMouseEnter(event) {
        this.setState({hover: true});
        if (this.props.mouseOwner === null) {
            this.props.dispatch(acquireMouse(this.props.id));
        }
    }

    onMouseDown(event) {
        if (event.button === 0 && this.props.id === this.props.mouseOwner) {
            this.setState({active: true, mouseOffset: this.props.position - event.clientX});
        }
    }

    onMouseLeave(event) {
        this.setState({hover: false});
        if (this.props.id === this.props.mouseOwner && !this.state.active) {
            document.body.style.cursor = '';
            this.props.dispatch(releaseMouse());
        }
    }

    onMouseMove(event) {
        if (this.state.active) {
            const targetPosition = event.clientX + this.state.mouseOffset;
            this.setState({targetPosition});
            if (targetPosition < this.props.leftLimit) {
                this.props.move(this.props.leftLimit);
            } else if (targetPosition >= this.props.rightLimit) {
                this.props.move(this.props.rightLimit - 1);
            } else {
                this.props.move(targetPosition);
            }
        } else if (this.state.hover) {
            this.setState({targetPosition: event.clientX + this.state.mouseOffset});
        }
    }

    disable() {
        this.setState({active: false});
        if (this.props.id === this.props.mouseOwner) {
            document.body.style.cursor = '';
            this.props.dispatch(releaseMouse());
        }
    }
}

export default connect(
    state => {
        return {
            mouseOwner: state.mouseOwner,
        };
    }
)(Radium(HorizontallyMovable));
