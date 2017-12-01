import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import MenuItem from '../containers/MenuItem'
import {closeMenu} from '../actions/manageMenu'

class Menu extends React.Component {

    static propTypes = {
        items: PropTypes.array.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    }

    constructor() {
        super();
        this.isMacOs = navigator.platform.slice(0, 3) === 'Mac';
        this.shiftPressed = false;
        this.modifierPressed = false;
    }

    onKeyDown(event) {
        switch (event.key) {
            case 'Shift':
                this.shiftPressed = true;
                break;
            case 'Control':
                if (!this.isMacOs) {
                    this.modifierPressed = true;
                }
                break;
            case 'Meta':
                if (this.isMacOs) {
                    this.modifierPressed = true;
                }
                break;
            default:
                if (this.modifierPressed) {
                    const key = this.shiftPressed ? event.key.toUpperCase() : event.key;
                    for (const item of this.props.items) {
                        for (const element of item.elements) {
                            if (element.onClick != null && element.shortcut != null && element.shortcut === key) {
                                element.onClick();
                                event.preventDefault();
                                this.shiftPressed = false;
                                this.modifierPressed = false;
                                return;
                            }
                        }
                    }
                }
                break;
        }
    }

    onKeyUp(event) {
        switch (event.key) {
            case 'Shift':
                this.shiftPressed = false;
                break;
            case 'Control':
                if (!this.isMacOs) {
                    this.modifierPressed = false;
                }
                break;
            case 'Meta':
                if (this.isMacOs) {
                    this.modifierPressed = false;
                }
                break;
            default:
                break;
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown.bind(this));
        window.removeEventListener('keyup', this.onKeyUp.bind(this));
    }

    render() {
        return (
            <div style={{
                position: 'absolute',
            }}>
                {this.props.items.map(item => (
                    <MenuItem
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        left={item.left}
                        elements={item.elements}
                    />
                ))}
                {this.props.isMenuOpen && (
                    <div
                        style={{
                            position: 'fixed',
                            width: `${this.props.width}px`,
                            height: `${this.props.height}px`,
                            zIndex: '50',
                        }}
                        onClick={() => {
                            this.props.dispatch(closeMenu());
                        }}
                    />
                )}
            </div>
        )
    }
}

export default connect(
    state => {
        return {
            isMenuOpen: state.menu.activeItem != null,
        };
    }
)(Menu);
