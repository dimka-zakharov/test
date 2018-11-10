import React, {Component} from 'react';
import '../App.css';
import {connect} from 'react-redux';
import Row from './Row.js';
import RowResizeBar from './RowResizeBar.js';
import {setLayout} from '../actions/main';
import {RESIZE_BAR_SIZE} from "./RowResizeBar";

class Main extends Component {
    constructor(props) {
        super(props);
        this.dragInfo = null;
        this.dragDelta = null;
        this.state = {dragRect: null};
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
    }

    render() {
        let rows = [];
        this.props.layout.forEach((v, i) => {
            if (i > 0) {
                rows.push(<RowResizeBar row={i-1} key={-i}/>);
            }
            rows.push(<Row row={v} rowIndex={i} key={i} total={this.props.layout.length}/>)
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
            this.dragInfo = value.indexOf(',') >= 0 ? {row: +value.split(',')[0], cell: +value.split(',')[1]} : {row: +value};
            this.dragDelta = [event.clientX - this.calculateTotalWidth(this.dragInfo.row+1, this.dragInfo.cell+1), event.clientY - this.calculateTotalHeight(this.dragInfo.row+1)];
            if (event.target.attributes['data-is-report']) {
                this.dragInfo.report = true;
            }
            this.setState({dragRect: this.getDragRect(event)});
        }
        return false;
    }

    mouseMove(event) {
        if (this.dragInfo === null) {
            return false;
        }
        this.setState({dragRect: this.getDragRect(event)});
        return true;
    }

    mouseUp(event) {
        if (this.dragInfo === null) {
            return false;
        }
        if (this.dragInfo.report) {
            //todo this.moveReport(event.clientX, event.clientY);
        } else if (this.dragInfo.cell !== undefined) {
            this.resizeCellWidth(event.clientX);
        } else {
            this.resizeRowHeight(event.clientY);
        }
        this.dragInfo = null;
        this.setState({dragRect: null});
        return false;
    }

    getDragRect(event) {
        if (this.dragInfo.report) {
            //todo this.moveReport(event.clientX, event.clientY);
            return [];
        } else if (this.dragInfo.cell !== undefined) {
            let left = this.calculateTotalWidth(this.dragInfo.row, this.dragInfo.cell);
            let top = this.calculateTotalHeight(this.dragInfo.row);
            let width = Math.max(event.clientX - this.screenLeft - left, 0);
            let height = this.calculateTotalHeight(this.dragInfo.row + 1) - top - RESIZE_BAR_SIZE - 4;
            return [left, top, width, height];
        } else {
            let left = 0;
            let top = this.calculateTotalHeight(this.dragInfo.row);
            let width = this.screenWidth - RESIZE_BAR_SIZE - 4;
            let height = Math.max(event.clientY - this.screenTop - top, 0);
            return [left, top, width, height];
        }
    }

    resizeCellWidth(eventX) {
        let minWidth = this.calculateTotalWidth(this.dragInfo.row, this.dragInfo.cell);
        let maxWidth = this.calculateTotalWidth(this.dragInfo.row, this.dragInfo.cell + 2);
        let width = eventX - this.screenLeft;
        if (width < minWidth + RESIZE_BAR_SIZE) {
            width = minWidth + RESIZE_BAR_SIZE;
        }
        if (width > maxWidth - RESIZE_BAR_SIZE) {
            width = maxWidth - RESIZE_BAR_SIZE;
        }
        let layout = JSON.parse(JSON.stringify(this.props.layout));
        layout[this.dragInfo.row].reports[this.dragInfo.cell].width = (width - minWidth) * 100 / this.screenWidth;
        layout[this.dragInfo.row].reports[this.dragInfo.cell + 1].width = (maxWidth - width) * 100 / this.screenWidth;
        this.props.setLayout(layout);
    }

    resizeRowHeight(eventY) {
        let minHeight = this.calculateTotalHeight(this.dragInfo.row);
        let maxHeight = this.calculateTotalHeight(this.dragInfo.row + 2);
        let height = eventY - this.screenTop;
        if (height < minHeight + RESIZE_BAR_SIZE) {
            height = minHeight + RESIZE_BAR_SIZE;
        }
        if (height > maxHeight - RESIZE_BAR_SIZE) {
            height = maxHeight - RESIZE_BAR_SIZE;
        }

        let layout = JSON.parse(JSON.stringify(this.props.layout));
        layout[this.dragInfo.row].height = (height - minHeight) * 100 / this.screenHeight;
        layout[this.dragInfo.row + 1].height = (maxHeight - height) * 100 / this.screenHeight;
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