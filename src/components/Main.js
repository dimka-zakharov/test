import React, {Component} from 'react';
import '../App.css';
import {connect} from 'react-redux';
import Row from './Row.js';
import RowResizeBar from './RowResizeBar.js';
import {setLayout} from '../actions/main';
import {RESIZE_BAR_SIZE} from "./RowResizeBar";

const RESIZE_MIN_SIZE = 120;

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {dragInfo: null, dragRect: null, dragDelta: null};
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
    }

    render() {
        let rows = [];
        this.props.layout.forEach((v, i) => {
            if (i > 0) {
                rows.push(<RowResizeBar row={i - 1} key={-i}/>);
            }
            rows.push(<Row row={v} rowIndex={i} animated={this.state.dragInfo === null} key={v.reports[0].id} total={this.props.layout.length}/>)
        });
        if (this.state.dragRect !== null) {
            let rect = this.state.dragRect;
            rows.push(<div className='resize-rect' style={{left: rect[0], top: rect[1], width: rect[2], height: rect[3]}}/>);
        }
        return (
            <main className="app-main">
                {rows}
            </main>
        );
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.mouseDown);
        document.addEventListener('mousemove', this.mouseMove);
        document.addEventListener('mouseup', this.mouseUp);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.mouseDown);
        document.removeEventListener('mousemove', this.mouseMove);
        document.removeEventListener('mouseup', this.mouseUp);
    }

    mouseDown(event) {
        if (event.target.attributes['data-position']) {
            if (!this.screenHeight) {
                let element = document.getElementsByTagName('main')[0];
                this.screenHeight = element.offsetHeight;
                this.screenTop = element.offsetTop;
                this.screenWidth = element.offsetWidth;
                this.screenLeft = element.offsetLeft;
            }

            let value = event.target.attributes['data-position'].value;
            let dragInfo = value.indexOf(',') >= 0 ? {row: +value.split(',')[0], cell: +value.split(',')[1]} : {row: +value};
            let dragRect = null;
            if (event.target.attributes['data-is-report']) {
                dragInfo.report = true;
                dragRect = this.getDragRect(event);
            }
            let dragDelta = [
                event.clientX - this.calculateTotalWidth(dragInfo.row, dragInfo.cell + 1) - this.screenLeft,
                event.clientY - this.calculateTotalHeight(dragInfo.row + 1) - this.screenTop
            ];
            console.log(dragDelta);
            this.setState({dragInfo, dragRect, dragDelta});
        } else {
            this.setState({dragInfo: null});
        }
        return false;
    }

    mouseMove(event) {
        if (this.state.dragInfo === null) {
            return false;
        }
        if (this.state.dragInfo.report) {
            //this.setState({dragRect: this.getDragRect(event)});
            //this.moveReport(event.clientX, event.clientY);
        } else if (this.state.dragInfo.cell !== undefined) {
            this.resizeCellWidth(event.clientX);
        } else {
            this.resizeRowHeight(event.clientY);
        }
        return true;
    }

    mouseUp(event) {
        if (this.state.dragInfo === null) {
            return false;
        }
        if (this.state.dragInfo.report) {
            //todo this.moveReport(event.clientX, event.clientY);
        }
        this.setState({dragInfo: null, dragRect: null});
        return false;
    }

    getDragRect(event) {
        if (this.state.dragInfo.report) {
            //todo this.moveReport(event.clientX, event.clientY);
            return [];
        } else if (this.state.dragInfo.cell !== undefined) {
            let left = this.calculateTotalWidth(this.state.dragInfo.row, this.state.dragInfo.cell);
            let top = this.calculateTotalHeight(this.state.dragInfo.row);
            let width = Math.max(event.clientX - this.screenLeft - left, 0);
            let height = this.calculateTotalHeight(this.state.dragInfo.row + 1) - top - RESIZE_BAR_SIZE - 4;
            return [left, top, width, height];
        } else {
            let left = 0;
            let top = this.calculateTotalHeight(this.state.dragInfo.row);
            let width = this.screenWidth - RESIZE_BAR_SIZE - 4;
            let height = Math.max(event.clientY - this.screenTop - top, 0);
            return [left, top, width, height];
        }
    }

    resizeCellWidth(eventX) {
        let minWidth = this.calculateTotalWidth(this.state.dragInfo.row, this.state.dragInfo.cell);
        let maxWidth = this.calculateTotalWidth(this.state.dragInfo.row, this.state.dragInfo.cell + 2);
        let width = eventX - this.screenLeft - this.state.dragDelta[0];
        if (width < minWidth + RESIZE_MIN_SIZE) {
            width = minWidth + RESIZE_MIN_SIZE;
        }
        if (width > maxWidth - RESIZE_MIN_SIZE) {
            width = maxWidth - RESIZE_MIN_SIZE;
        }
        let layout = JSON.parse(JSON.stringify(this.props.layout));
        layout[this.state.dragInfo.row].reports[this.state.dragInfo.cell].width = (width - minWidth) * 100 / this.screenWidth;
        layout[this.state.dragInfo.row].reports[this.state.dragInfo.cell + 1].width = (maxWidth - width) * 100 / this.screenWidth;
        this.props.setLayout(layout);
    }

    resizeRowHeight(eventY) {
        let minHeight = this.calculateTotalHeight(this.state.dragInfo.row);
        let maxHeight = this.calculateTotalHeight(this.state.dragInfo.row + 2);
        let height = eventY - this.screenTop - this.state.dragDelta[1];
        if (height < minHeight + RESIZE_MIN_SIZE) {
            height = minHeight + RESIZE_MIN_SIZE;
        }
        if (height > maxHeight - RESIZE_MIN_SIZE) {
            height = maxHeight - RESIZE_MIN_SIZE;
        }

        let layout = JSON.parse(JSON.stringify(this.props.layout));
        layout[this.state.dragInfo.row].height = (height - minHeight) * 100 / this.screenHeight;
        layout[this.state.dragInfo.row + 1].height = (maxHeight - height) * 100 / this.screenHeight;
        this.props.setLayout(layout);
    }

    calculateTotalHeight(rowIndex) {
        let result = 0;
        for (let i = 0; i < rowIndex; i++) {
            let height = this.props.layout[i].height;
            result += height === '*' ? this.screenHeight / this.props.layout.length : height * this.screenHeight / 100;
        }
        return result;
    }

    calculateTotalWidth(rowIndex, cellIndex) {
        let result = 0;
        for (let i = 0; i < cellIndex; i++) {
            let width = this.props.layout[rowIndex].reports[i].width;
            result += width === '*' ? this.screenWidth / this.props.layout[rowIndex].reports.length : width * this.screenWidth / 100;
        }
        return result;
    }
}

function mapStateToProps(state) {
    return {
        layout: state.main.layout
    }
}

const mapDispatchToProps = {setLayout};

export default connect(mapStateToProps, mapDispatchToProps)(Main);