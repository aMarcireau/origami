import React from 'react'
import Radium from 'radium'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {
    selectPublication,
    unselectPublication,
} from '../actions/managePublication'
import {
    setGraphZoomAndOffset,
    storeGraphNodes,
    lockGraphNode,
} from '../actions/manageGraph'
import {
    PUBLICATION_STATUS_UNVALIDATED,
    PUBLICATION_STATUS_DEFAULT,
    PUBLICATION_STATUS_IN_COLLECTION,
} from '../constants/enums'
import * as d3 from 'd3'

class Graph extends React.Component {

    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        zoom: PropTypes.number.isRequired,
        xOffset: PropTypes.number.isRequired,
        yOffset: PropTypes.number.isRequired,
    }

    static viewBoxFromProps(props) {
        const zoomRatio = 1 / (2 ** (props.zoom / 20));
        const zoomedWidth = props.width * zoomRatio;
        const zoomedHeight = props.height * zoomRatio;
        return `${-zoomedWidth / 2 + props.xOffset} ${-zoomedHeight / 2 + props.yOffset} ${zoomedWidth} ${zoomedHeight}`;
    }

    constructor() {
        super();
        this.domSvg = null;
        this.svg = null;
        this.nodes = [];
        this.edges = [];
        this.simulation = d3.forceSimulation(this.nodes)
            .stop()
            .force('link', d3.forceLink(this.edges).distance(80).strength(1).id(node => node.doi))
            .force('centerX', d3.forceX().strength(0.3))
            .force('centerY', d3.forceY().strength(0.3))
            .force('charge', d3.forceManyBody().strength(-1000))
            .on('tick', () => {
                this.d3Node.attr('transform', node => `translate(${node.x}, ${node.y})`);
                this.d3Edge
                    .attr('x1', edge => edge.source.x)
                    .attr('y1', edge => edge.source.y)
                    .attr('x2', edge => edge.target.x)
                    .attr('y2', edge => edge.target.y)
                ;
            })
            .on('end', () => {
                if (this.nodes.length > 0) {
                    this.props.dispatch(storeGraphNodes(this.nodes.map(node => {
                        return {
                            doi: node.doi,
                            x: node.x,
                            y: node.y,
                        };
                    })));
                }
            })
        ;
        this.d3Node = null;
        this.d3Edge = null;
        this.zoom = null;
        this.reheatSimulation = false;
    }

    componentWillReceiveProps(nextProps) {

        // update the dimensions if required
        if (
            nextProps.width != this.props.width
            || nextProps.height != this.props.height
            || nextProps.zoom != this.props.zoom
            || nextProps.xOffset != this.props.xOffset
            || nextProps.yOffset != this.props.yOffset
        ) {
            this.svg.attr('width', nextProps.width);
            this.svg.attr('height', nextProps.height);
            this.svg.attr('viewBox', Graph.viewBoxFromProps(nextProps));
            this.zoom.scaleTo(this.svg, 2 ** (nextProps.zoom / 20));
        }

        // update the nodes and edges if required
        // the simulation is reheated if the number of nodes or edges changes
        let updateRequired = false;
        const zoomRatio = 1 / (2 ** (nextProps.zoom / 2));
        const zoomedWidth = nextProps.width * zoomRatio;
        const zoomedHeight = nextProps.height * zoomRatio;
        let doiToConnectedNodes = null;
        for (const publication of nextProps.publications) {
            let found = false;
            for (const node of this.nodes) {
                if (publication.doi === node.doi) {
                    node.keep = true;
                    found = true;
                    if (publication.status !== node.status || publication.selected !== node.selected || publication.locked !== node.locked) {
                        updateRequired = true;
                        node.status = publication.status;
                        node.selected = publication.selected;
                        if (node.locked && !publication.locked) {
                            node.fx = null;
                            node.fy = null;
                            this.reheatSimulation = true;
                        }
                        node.locked = publication.locked;
                    }
                    break;
                }
            }
            if (!found) {
                updateRequired = true;
                if (doiToConnectedNodes === null) {
                    doiToConnectedNodes = new Map();
                    const doiToNode = new Map(this.nodes.map(node => [node.doi, node]));
                    for (const edge of nextProps.edges) {
                        if (doiToNode.has(edge.source)) {
                            if (doiToConnectedNodes.has(edge.target)) {
                                doiToConnectedNodes.get(edge.target).push(doiToNode.get(edge.source));
                            } else {
                                doiToConnectedNodes.set(edge.target, [doiToNode.get(edge.source)]);
                            }
                        }
                        if (doiToNode.has(edge.target)) {
                            if (doiToConnectedNodes.has(edge.source)) {
                                doiToConnectedNodes.get(edge.source).push(doiToNode.get(edge.target));
                            } else {
                                doiToConnectedNodes.set(edge.source, [doiToNode.get(edge.target)]);
                            }
                        }
                    }
                }
                if (publication.locked) {
                    publication.fx = publication.x;
                    publication.fy = publication.y;
                } else if (publication.x == null || publication.y == null) {
                    this.reheatSimulation = true;
                    const connectedNodes = doiToConnectedNodes.get(publication.doi);
                    if (connectedNodes == null) {
                        publication.x = 80 * Math.random();
                        publication.y = 80 * Math.random();
                    } else if (connectedNodes.length === 1) {
                        const angle = 2 * Math.PI * Math.random();
                        publication.x = connectedNodes[0].x + 80 * Math.cos(angle);
                        publication.y = connectedNodes[0].y + 80 * Math.sin(angle);
                    } else {
                        publication.x = 0;
                        publication.y = 0;
                        for (const node of connectedNodes) {
                            publication.x += node.x;
                            publication.y += node.y;
                        }
                        publication.x /= connectedNodes.length;
                        publication.y /= connectedNodes.length;
                    }
                }
                publication.keep = true;
                this.nodes.push(publication);
            }
        }
        for (let index = this.nodes.length - 1; index >= 0; --index) {
            if (this.nodes[index].keep) {
                delete this.nodes[index].keep;
                this.nodes[index].isCiter = nextProps.doisCitingSelected.has(this.nodes[index].doi);
            } else {
                updateRequired = true;
                this.reheatSimulation = true;
                this.nodes.splice(index, 1);
            }
        }
        if (this.edges.length != nextProps.edges.length) {
            updateRequired = true;
            this.reheatSimulation = true;
        }
        this.edges = nextProps.edges.map(edge => {
            return {source: edge.source, target: edge.target};
        });
        if (this.reheatSimulation && nextProps.display === 0) {
            this.reheatSimulation = false;
            this.simulation.alpha(1);
            this.restart();
        } else if (updateRequired) {
            this.restart();
        }
    }

    restart() {

        // update edges data
        this.d3Edge = this.d3Edge.data(this.edges, edge => `${edge.source} ${edge.target}`);

        // remove 'exit' edges
        this.d3Edge.exit().remove();

        // create 'enter' edges
        this.d3Edge = this.d3Edge.enter().append('line')
            .attr('stroke-width', 2)
            .attr('stroke', this.props.colors.secondaryContent)
            .lower()
            .merge(this.d3Edge)
        ;

        // update nodes data
        this.d3Node = this.d3Node.data(this.nodes, node => `${node.doi}`);

        // remove 'exit' nodes
        this.d3Node.exit().remove();

        // update existing nodes
        // only the lock displays are updated here, color is configured after merging 'enter' nodes
        this.d3Node.selectAll('circle.locked').filter(node => !node.locked).remove();

        // create 'enter' nodes
        const d3NodeGroup = this.d3Node.enter().append('g');
        d3NodeGroup.filter(node => node.locked).append('circle')
            .attr('r', 23)
            .attr('class', 'locked')
            .attr('fill', 'none')
            .attr('stroke-width', 2)
            .attr('stroke', this.props.colors.secondaryContent)
        ;
        d3NodeGroup.append('circle')
            .attr('r', 20)
            .attr('class', 'publication')
        ;
        d3NodeGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'central')
            .attr('font-family', 'roboto')
            .attr('font-size', '20px')
            .attr('fill', this.props.colors.background)
            .style('user-select', 'none')
            .style('pointer-events', 'none')
            .text(node => {
                const firstConsecutivePair = node.title.match(/(?:(?:the|a|an)\s+)?([a-z0-9]{2})/i);
                const title = firstConsecutivePair ? firstConsecutivePair[1] : node.title;
                return title.charAt(0).toUpperCase() + title.charAt(1).toLowerCase();
            })
        ;
        this.d3Node = d3NodeGroup.merge(this.d3Node);

        // configure all the nodes (updated and 'enter')
        this.d3Node.attr('class', node => node.locked ? 'locked' : 'unlocked');
        this.d3Node.on('click', node => {
            if (node.selected) {
                this.props.dispatch(unselectPublication());
            } else {
                this.props.dispatch(selectPublication(node.doi));
            }
            d3.event.stopPropagation();
        });
        const colors = this.props.colors;
        this.d3Node.selectAll('circle.publication')
            .style('cursor', 'pointer')
            .attr('fill', node => (
                node.selected ?
                this.props.colors.active
                : (node.isCiter ?
                    this.props.colors.valid
                    : (node.status === PUBLICATION_STATUS_IN_COLLECTION ? this.props.colors.link : this.props.colors.sideSeparator)
                )
            ))
            .on('mouseover', function(node) {
                d3.select(this).attr('fill', colors.active);
            })
            .on('mouseout', function(node) {
                d3.select(this).attr('fill', node.selected ?
                    colors.active
                    : (node.isCiter ?
                        colors.valid
                        : (node.status === PUBLICATION_STATUS_IN_COLLECTION ? colors.link : colors.sideSeparator)
                    )
                );
            })
        ;
        this.d3Node.call(d3.drag()
            .subject(() => this.simulation.find(d3.event.x, d3.event.y))
            .on('start', () => {
                if (!d3.event.active) {
                    this.simulation.alphaTarget(0.3).restart();
                }
                d3.event.subject.fx = d3.event.subject.x;
                d3.event.subject.fy = d3.event.subject.y;
            })
            .on('drag', () => {
                d3.event.subject.fx = d3.event.x;
                d3.event.subject.fy = d3.event.y;
            })
            .on('end', () => {
                if (!d3.event.active) {
                    this.simulation.alphaTarget(0);
                }
                if ((this.props.sticky || d3.event.subject.locked) && d3.event.subject.status === PUBLICATION_STATUS_IN_COLLECTION) {
                    if (!d3.event.subject.locked) {
                        d3.event.subject.locked = true;
                        this.d3Node.filter(node => node === d3.event.subject).append('circle')
                            .attr('r', 23)
                            .attr('class', 'locked')
                            .attr('fill', 'none')
                            .attr('stroke-width', 2)
                            .attr('stroke', this.props.colors.secondaryContent)
                        ;
                    }
                    this.props.dispatch(lockGraphNode(d3.event.subject.doi, d3.event.subject.fx, d3.event.subject.fy));
                } else {
                    d3.event.subject.fx = null;
                    d3.event.subject.fy = null;
                }
            })
        );
        this.simulation.nodes(this.nodes);
        this.simulation.force('link').links(this.edges);
        this.simulation.restart();
    }

    componentDidMount() {
        this.svg = d3.select(this.domSvg);
        this.svg.call(d3.drag()
            .on('start', () => {
                this.svg.style('cursor', 'move');
            })
            .on('drag', () => {
                const zoomRatio = 1 / (2 ** (this.props.zoom / 20));
                this.props.dispatch(setGraphZoomAndOffset(
                    this.props.zoom,
                    this.props.xOffset - d3.event.dx * zoomRatio,
                    this.props.yOffset - d3.event.dy * zoomRatio,
                ));
            })
            .on('end', () => {
                this.svg.style('cursor', 'default');
            })
        );
        this.zoom = d3.zoom()
            .scaleExtent([2 ** (-50 / 20), 2 ** (50 / 20)])
            .on('zoom', () => {
                const newZoom = Math.round(20 * Math.log(d3.event.transform.k) / Math.log(2));
                if (d3.event.sourceEvent != null && d3.event.sourceEvent.type !== 'zoom' && newZoom != this.props.zoom) {
                    const scale = 2 ** (-this.props.zoom / 20) - 2 ** (-newZoom / 20);
                    this.props.dispatch(setGraphZoomAndOffset(
                        newZoom,
                        this.props.xOffset + (d3.event.sourceEvent.clientX - this.domSvg.getBoundingClientRect().left - this.props.width / 2) * scale,
                        this.props.yOffset + (d3.event.sourceEvent.clientY - this.domSvg.getBoundingClientRect().top - this.props.height / 2) * scale
                    ));
                }
            })
        ;
        this.svg.call(this.zoom);
        this.d3Node = this.svg.selectAll('.node');
        this.d3Edge = this.svg.selectAll('.edge');
        this.simulation.alpha(0);
        this.restart();
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <svg
                ref={domSvg => {this.domSvg = domSvg}}
                width={this.props.width}
                height={this.props.height}
                viewBox={Graph.viewBoxFromProps(this.props)}
            />
        )
    }
}

export default connect(
    state => {
        const citersCountByDoi = new Map();
        for (let [doi, publication] of state.publications.entries()) {
            for (let citer of publication.citers) {
                if (state.publications.get(citer).status === PUBLICATION_STATUS_DEFAULT) {
                    if (citersCountByDoi.has(citer)) {
                        citersCountByDoi.set(citer, citersCountByDoi.get(citer) + 1);
                    } else {
                        citersCountByDoi.set(citer, 1);
                    }
                }
            }
        }
        const recommandedDois = new Set(Array.from(citersCountByDoi.entries()).filter(
            ([doi, count]) => count >= state.graph.threshold
        ).map(
            ([doi, count]) => doi
        ));
        const publications = Array.from(state.publications.entries()).filter(
            ([doi, publication]) => publication.status === PUBLICATION_STATUS_IN_COLLECTION || recommandedDois.has(doi)
        ).map(
            ([doi, publication]) => {return {...publication, doi}}
        );
        const selectedPublicationAndDoi = Array.from(state.publications.entries()).find(([doi, publication]) => publication.selected);
        return {
            zoom: state.graph.zoom,
            xOffset: state.graph.xOffset,
            yOffset: state.graph.yOffset,
            publications,
            edges: [].concat.apply(
                [],
                publications.filter(publication => publication.status === PUBLICATION_STATUS_IN_COLLECTION).map(
                    publication => publication.citers.filter(
                        citer => state.publications.get(citer).status === PUBLICATION_STATUS_IN_COLLECTION || recommandedDois.has(citer)
                    ).map(citer => {
                        return {source: publication.doi, target: citer};
                    })
                )
            ),
            doisCitingSelected: new Set(selectedPublicationAndDoi ? selectedPublicationAndDoi[1].citers : []),
            recommandedDois,
            display: state.menu.display,
            sticky: state.graph.sticky,
            colors: state.colors,
        };
    }
)(Radium(Graph));
