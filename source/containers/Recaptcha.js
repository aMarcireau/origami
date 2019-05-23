import React from 'react'
import Radium from 'radium'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {
    resolveHtml,
    unblockScholar,
    scholarDisconnect,
} from '../actions/manageScholar'
import {
    SCHOLAR_STATUS_IDLE,
    SCHOLAR_STATUS_FETCHING,
    SCHOLAR_STATUS_BLOCKED_HIDDEN,
    SCHOLAR_STATUS_BLOCKED_VISIBLE,
    SCHOLAR_STATUS_UNBLOCKING,
} from '../constants/enums'

class Recaptcha extends React.Component {

    static propTypes = {
        style: PropTypes.object,
    }

    constructor() {
        super();
        this.container = null;
        this.unblocking = false;
        this.keepPolling = false;
    }

    componentWillReceiveProps(nextProps) {

        console.log('Recaptcha received props'); // @DEBUG

        if (this.container.firstChild) {
            if (nextProps.scholarStatus === SCHOLAR_STATUS_IDLE || nextProps.scholarStatus === SCHOLAR_STATUS_FETCHING) {
                this.container.removeChild(this.container.firstChild);
                this.unblocking = false;
                this.keepPolling = false;
            } else if (nextProps.scholarStatus === SCHOLAR_STATUS_UNBLOCKING && !this.unblocking) {
                this.unblocking = true;
                this.keepPolling = false;
                window.setTimeout(() => {
                    this.props.dispatch(unblockScholar());
                }, this.props.scholarStatus === SCHOLAR_STATUS_BLOCKED_VISIBLE ? 500 : 0);
            }
        } else if (nextProps.scholarStatus === SCHOLAR_STATUS_BLOCKED_HIDDEN || nextProps.scholarStatus === SCHOLAR_STATUS_BLOCKED_VISIBLE) {

            console.log('will create webview'); // @DEBUG


            const webview = document.createElement('webview');
            webview.src = nextProps.url;
            webview.style.position = 'absolute';
            webview.style.width = '100%';
            webview.style.height = '100%';
            webview.addEventListener('dom-ready', () => {

                console.log('webview DOM ready'); // @DEBUG

                this.container.firstChild.getWebContents().executeJavaScript('document.documentElement.outerHTML').then(text => {

                    console.log('javascript executed', this.container.firstChild.getURL()); // @DEBUG

                    nextProps.dispatch(resolveHtml(this.container.firstChild.getURL(), text));
                });
            });
            this.keepPolling = true;
            const poll = () => {
                if (this.keepPolling) {
                    fetch('https://scholar.google.com/favicon.ico', {
                        method: 'GET',
                        headers: new Headers({
                            'pragma': 'no-cache',
                            'cache-control': 'no-cache',
                        }),
                    })
                        .then(response => {
                            if (this.keepPolling) {
                                window.setTimeout(poll, 1000);
                            }
                        })
                        .catch(() => {
                            this.keepPolling = false;
                            this.props.dispatch(scholarDisconnect());
                        })
                    ;
                }
            };
            window.setTimeout(poll, 200);
            this.container.appendChild(webview);
            this.unblocking = false;

            console.log(this.container, webview); // @DEBUG
        }
        for (const property of ['left', 'top', 'width', 'height']) {
            if (nextProps.style[property] !== this.props.style[property]) {
                this.container.style[property] = nextProps.style[property];
            }
        }
    }

    componentWillUnmount() {
        if (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
            this.unblocking = false;
            this.keepPolling = false;
        }
    }

    render() {
        return (
            <div
                ref={container => {this.container = container}}
                style={this.props.style}
            />
        )
    }

    shouldComponentUpdate() {
        return false;
    }
}

export default connect(
    state => {
        return {
            scholarStatus: state.scholar.status,
            url: state.scholar.url,
        };
    }
)(Recaptcha);
