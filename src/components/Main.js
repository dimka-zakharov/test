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
        let cursor = this.state.dragRect === null;
        this.props.layout.forEach((v, i) => {
            rows.push(<Row row={v} rowIndex={i} animated={this.state.dragInfo === null} cursor={cursor} dragging={!cursor} key={v.reports[0].id} total={this.props.layout.length}/>)
            rows.push(<RowResizeBar row={i} cursor={cursor && i !== this.props.layout.length - 1} dragging={!cursor} key={-i - 1}/>);
        });
        if (this.state.dragRect !== null) {
            let rect = this.state.dragRect;
            rows.push(<div className='drag-rect' style={{left: rect[0], top: rect[1], width: rect[2], height: rect[3]}}/>);
        }
        return ([
            <RowResizeBar row={-1} key={0} dragging={!cursor}/>,
            <main className="app-main">
                {rows}
            </main>
        ]);
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
            let dragRect = event.target.attributes['data-is-report'] ? [0, 0, 0, 0] : null;
            let dragDelta = [
                event.clientX - this.calculateTotalWidth(dragInfo.row, dragInfo.cell + (event.target.attributes['data-is-report'] ? 0 : 1)) - this.screenLeft,
                event.clientY - this.calculateTotalHeight(dragInfo.row + (event.target.attributes['data-is-report'] ? 0 : 1)) - this.screenTop
            ];
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
        if (this.state.dragRect) {
            this.setState({dragRect: this.getDragRect(event)});
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
        if (this.state.dragRect) {
            //todo this.moveReport(event.clientX, event.clientY);
        }
        this.setState({dragInfo: null, dragRect: null});
        return false;
    }

    getDragRect(event) {
        return [
            event.clientX - this.screenLeft - this.state.dragDelta[0],
            event.clientY - this.screenTop - this.state.dragDelta[1],
            this.calculateTotalWidth(this.state.dragInfo.row, this.state.dragInfo.cell + 1) - this.calculateTotalWidth(this.state.dragInfo.row, this.state.dragInfo.cell) - RESIZE_BAR_SIZE,
            this.calculateTotalHeight(this.state.dragInfo.row + 1) - this.calculateTotalHeight(this.state.dragInfo.row) - RESIZE_BAR_SIZE
        ];
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