import React from 'react'
import Radium from 'radium'
import {connect} from 'react-redux'
import {publicationFromDoi} from '../actions/manageCrossref'
import {doiPattern} from '../libraries/utilities'

class AddDoi extends React.Component {

    constructor() {
        super();
        this.state = {
            valid: false,
            value: '',
        };
    }

    render() {
        return (
            <div style={{
                height: '40px',
                borderBottom: `1px solid ${this.props.colors.sideSeparator}`,
                verticalAlign: 'top',
                overflow: 'hidden',
                position: 'relative',
            }}>
                <input
                    type='text'
                    placeholder='Add a DOI'
                    style={{
                        height: '39px',
                        width: 'calc(100% - 39px)',
                        outline: 'none',
                        border: 'none',
                        paddingTop: 0,
                        paddingRight: '12px',
                        paddingBottom: 0,
                        paddingLeft: '12px',
                        fontSize: '14px',
                        color: this.props.colors.content,
                        backgroundColor: this.props.colors.background,
                    }}
                    value={this.state.value}
                    onChange={this.handleChange.bind(this)}
                    onKeyPress={event => {
                        if (this.props.connected && this.state.valid && event.key == 'Enter') {
                            this.props.dispatch(publicationFromDoi(this.state.value.match(doiPattern)[1], new Date().getTime()));
                            this.setState({valid: false, value: ''});
                        }
                    }}
                />
                <button
                    key={`validate-${this.props.connected}`}
                    disabled={!this.props.connected || !this.state.valid}
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        width: '40px',
                        height: '39px',
                        textDecoration: 'none',
                        padding: 0,
                        borderTop: 'none',
                        borderRight: 'none',
                        borderBottom: 'none',
                        borderLeft: `1px solid ${this.props.colors.sideSeparator}`,
                        display: 'inline-block',
                        textAlign: 'center',
                        outline: 'none',
                        backgroundColor: this.props.colors.background,
                        ':hover': {
                            cursor: 'pointer',
                        },
                        ':active': {
                            backgroundColor: this.props.colors.sideBackground,
                        },
                    }}
                    onClick={() => {
                        this.props.dispatch(publicationFromDoi(this.state.value.match(doiPattern)[1], new Date().getTime()));
                        this.setState({valid: false, value: ''});
                    }}
                >
                    {this.props.connected ? (
                        <svg width='39px' height='39px' viewBox='0 0 39 39'>
                            <path
                                style={{
                                    fill: this.state.valid ?
                                        (
                                            Radium.getState(this.state, `validate-${this.props.connected}`, ':hover') ?
                                            this.props.colors.valid
                                            : this.props.colors.link
                                        )
                                        : this.props.colors.sideSeparator,
                                }}
                                d='M23.4461524,8.86121593 L25.4461524,8.86121593 L25.4461524,23.8612159 L23.4461524,23.8612159 L23.4461524,8.86121593 Z M14.4461524,23.8612159 L25.4461524,23.8612159 L25.4461524,25.8612159 L14.4461524,25.8612159 L14.4461524,23.8612159 Z'
                                transform='translate(19.946152, 17.361216) rotate(30.000000) translate(-19.946152, -17.361216)'
                            />
                        </svg>
                    ) : (
                        <svg width='39px' height='39px' viewBox='0 0 39 39'>
                            <rect fill={this.props.colors.sideSeparator} x='18.5' y='10' width='2' height='12' />
                            <rect fill={this.props.colors.sideSeparator} x='18.5' y='24' width='2' height='2' />
                            <path
                                fill={this.props.colors.sideSeparator}
                                d='M17,12.222571 L17,14.2607883 C14.6155751,14.7660864 12.4926648,15.9794772 10.8616982,17.6705318 L9.33401879,16.374319 C11.3417684,14.2545919 14.0053849,12.7623865 17,12.222571 Z M22,12.222571 C24.9946151,12.7623865 27.6582316,14.2545919 29.6659812,16.374319 L28.1383018,17.6705318 C26.5073352,15.9794772 24.3844249,14.7660864 22,14.2607883 L22,12.222571 Z M17,16.3150437 L17,18.3983785 C15.8317549,18.7823614 14.7822951,19.4281425 13.9210214,20.2663212 L12.3904334,18.9676404 C13.6403988,17.704038 15.2248154,16.7719446 17,16.3150437 Z M22,16.3150437 C23.7751846,16.7719446 25.3596012,17.704038 26.6095666,18.9676404 L25.0789786,20.2663212 C24.2177049,19.4281425 23.1682451,18.7823614 22,18.3983785 L22,16.3150437 Z M17,20.5440422 C16.4317795,20.8048359 15.9113164,21.1517854 15.4553369,21.5681646 L16.9991072,22.8780304 C16.9994048,22.8777917 16.9997024,22.8775531 17,22.8773145 L17,20.5440422 Z M22,20.5440422 C22.5682205,20.8048359 23.0886836,21.1517854 23.5446631,21.5681646 L22.0008928,22.8780304 C22.0005952,22.8777917 22.0002976,22.8775531 22,22.8773145 L22,20.5440422 Z'
                            />
                        </svg>
                    )}
                </button>
            </div>
        )
    }

    handleChange(event) {
        this.setState({
            value: event.target.value,
            valid: doiPattern.test(event.target.value)
        });
    }
}

export default connect(
    state => {
        return {
            connected: state.connected,
            colors: state.colors,
        }
    }
)(Radium(AddDoi));
