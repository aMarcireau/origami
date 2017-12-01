import React from 'react'
import Radium from 'radium'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import Graph from './Graph'
import SetGraphZoom from './SetGraphZoom'
import Checkbox from '../components/Checkbox'
import {
    setGraphZoomAndOffset,
    enableStickyGraph,
    disableStickyGraph,
    releaseGraphNode,
} from '../actions/manageGraph'

class GraphWithToolbar extends React.Component {

    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        leftPosition: PropTypes.number.isRequired,
    }

    render() {
        const offset = (this.props.width - 218) / 2;
        return (
            <div style={{
                width: this.props.width,
                height: this.props.height,
            }}>
                <div style={{
                    width: '100%',
                    height: '40px',
                    borderBottom: `1px solid ${this.props.colors.sideSeparator}`,
                    position: 'relative',
                }}>
                    <button
                        key='graph-with-toolbar-center'
                        style={{
                            position: 'absolute',
                            left: `${offset}px`,
                            textDecoration: 'none',
                            padding: 0,
                            height: '39px',
                            lineHeight: '39px',
                            border: 'none',
                            display: 'inline-block',
                            textAlign: 'center',
                            outline: 'none',
                            fontSize: '14px',
                            color: this.props.isGraphCentered ? this.props.colors.secondaryContent : this.props.colors.link,
                            backgroundColor: this.props.colors.background,
                            disabled: this.props.isGraphCentered,
                            ':hover': {
                                cursor: this.props.isGraphCentered ? '' : 'pointer',
                                color: this.props.isGraphCentered ? this.props.colors.secondaryContent : this.props.colors.active,
                            },
                        }}
                        onClick={() => {
                            this.props.dispatch(setGraphZoomAndOffset(this.props.zoom, 0, 0));
                        }}
                    >Center</button>
                    <span style={{
                        height: '39px',
                        lineHeight: '39px',
                        color: this.props.colors.content,
                        fontSize: '14px',
                        fontFamily: 'robotoLight',
                        textAlign: 'center',
                        position: 'absolute',
                        left: `${offset + 51}px`,
                        paddingLeft: '10px',
                        borderLeft: `1px solid ${this.props.colors.sideSeparator}`,
                    }}>Zoom</span>
                    <SetGraphZoom
                        left={offset + 51 + 62}
                        width={100}
                        zoom={0}
                        zoomMinimum={-50}
                        zoomMaximum={50}
                    />
                </div>
                <Graph
                    width={this.props.width}
                    height={this.props.height - 80}
                    zoom={0}
                    xOffset={0}
                    yOffset={0}
                />
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    left: 0,
                    bottom: 0,
                    height: '41px',
                    lineHeight: '39px',
                    textAlign: 'center',
                    borderTop: `1px solid ${this.props.colors.sideSeparator}`,
                    borderBottom: `solid 1px ${this.props.colors.sideSeparator}`,
                }}>
                    <div style={{
                        display: 'inline-block',
                        height: '100%',
                    }}>
                        <span style={{
                            fontSize: '14px',
                            color: this.props.colors.content,
                            fontFamily: 'robotoLight',
                            height: '39px',
                            lineHeight: '39px',
                            paddingRight: '10px',
                        }}>
                            Sticky
                        </span>
                        <div style={{
                            display: 'inline-block',
                            height: '39px',
                            lineHeight: '39px',
                            verticalAlign: 'middle',
                            paddingRight: '10px',
                            paddingTop: '9.5px',
                            borderRight: `1px solid ${this.props.colors.sideSeparator}`,
                        }}>
                            <Checkbox
                                checked={this.props.sticky}
                                onClick={() => {
                                    if (this.props.sticky) {
                                        this.props.dispatch(disableStickyGraph());
                                    } else {
                                        this.props.dispatch(enableStickyGraph());
                                    }
                                }}
                                colors={this.props.colors}
                            />
                        </div>
                        <span
                            key={this.props.selectedPublication == null ? 'null' : this.props.selectedPublication.doi}
                            style={{
                                height: '39px',
                                color: this.props.selectedPublication == null || !this.props.selectedPublication.locked ? this.props.colors.secondaryContent : this.props.colors.link,
                                fontSize: '14px',
                                paddingLeft: '10px',
                                textAlign: 'center',
                                cursor: this.props.selectedPublication == null || !this.props.selectedPublication.locked ? '' : 'pointer',
                                ':hover': {
                                    color: (this.props.selectedPublication == null || !this.props.selectedPublication.locked ?
                                        this.props.colors.secondaryContent
                                        : this.props.colors.active
                                    ),
                                },
                            }}
                            onClick={() => {
                                if (this.props.selectedPublication != null && this.props.selectedPublication.locked) {
                                    this.props.dispatch(releaseGraphNode(this.props.selectedPublication.doi));
                                }
                            }}
                        >
                            Release node
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => {
        const selectedPublicationCandidates = Array.from(state.publications.entries()).filter(
            ([doi, publication]) => publication.selected
        ).map(
            ([doi, publication]) => {
                return {
                    ...publication,
                    doi,
                };
            }
        );
        return {
            zoom: state.graph.zoom,
            sticky: state.graph.sticky,
            selectedPublication: selectedPublicationCandidates.length > 0 ? selectedPublicationCandidates[0] : null,
            isGraphCentered: state.graph.xOffset === 0 && state.graph.yOffset === 0,
            colors: state.colors,
        };
    }
)(Radium(GraphWithToolbar));
