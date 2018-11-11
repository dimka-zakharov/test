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
        this.state = {dragInfo: null, dragRect: null, dragDelta: null, dragTarget: null};
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
    }

    render() {
        let rows = [];
        let cursor = this.state.dragRect === null;
        this.props.layout.forEach((v, i) => {
            rows.push(<Row row={v} rowIndex={i} cursor={cursor} key={v.reports[0].id} dragInfo={Main.restoreDataPositionAttribute(this.state.dragInfo)} dragTarget={this.state.dragTarget} total={this.props.layout.length}/>);
            rows.push(<RowResizeBar row={i} cursor={cursor && i !== this.props.layout.length - 1} selected={this.state.dragTarget === i.toString()} key={-i - 1}/>);
        });
        let children = [
            <RowResizeBar row={-1} key={0} selected={this.state.dragTarget === '-1'}/>,
            <div className="app-sub-main" key={-1}>
                {rows}
            </div>
        ];
        if (this.state.dragRect !== null) {
            let rect = this.state.dragRect;
            children.push(<div className='drag-rect' key={-2} style={{left: rect[0], top: rect[1], width: rect[2], height: rect[3]}}/>);
        }
        return (
            <main className="app-main">
                {children}
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
        let target = event.target;
        if (target.attributes['data-position']) {
            let element = document.getElementsByClassName('app-main')[0];
            this.screenHeight = element.offsetHeight;
            this.screenTop = element.offsetTop;
            this.screenWidth = element.offsetWidth;
            this.screenLeft = element.offsetLeft;

            let dragInfo = Main.parseDataPositionAttribute(target.attributes['data-position'].value);
            let dragRect = target.attributes['data-is-report'] ? [target.offsetLeft, target.offsetTop, target.offsetWidth, target.offsetHeight] : null;
            let dragTargetRect = null;
            let dragDelta = [
                event.clientX - this.calculateTotalWidth(dragInfo.row, dragInfo.cell + (target.attributes['data-is-report'] ? 0 : 1)) - this.screenLeft,
                event.clientY - this.calculateTotalHeight(dragInfo.row + (target.attributes['data-is-report'] ? 0 : 1)) - this.screenTop
            ];
            this.setState({dragInfo, dragRect, dragTargetRect, dragDelta});
        } else {
            this.setState({dragInfo: null, dragRect: null, dragTargetRect: null, dragDelta: null});
        }
        return false;
    }

    static parseDataPositionAttribute(value) {
        return value.indexOf(',') >= 0 ? {row: +value.split(',')[0], cell: +value.split(',')[1]} : {row: +value};
    }

    static restoreDataPositionAttribute(value) {
        return value === null ? null : (value.cell === undefined ? value.row.toString() : value.row + ',' + value.cell);
    }

    mouseMove(event) {
        if (this.state.dragInfo === null) {
            return false;
        }
        if (this.state.dragRect) {
            this.setState({dragRect: this.getDragRect(event), dragTarget: Main.getDragTargetInfo(event)});
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
            let dragTarget = Main.parseDataPositionAttribute(this.state.dragTarget);
            let layout = JSON.parse(JSON.stringify(this.props.layout));
            let report = layout[this.state.dragInfo.row].reports.splice(this.state.dragInfo.cell, 1)[0];
            report.width = '*';
            if (dragTarget.cell === undefined) {
                layout.forEach(v => v.height = '*');
                layout.splice(dragTarget.row + 1, 0, {height: '*', reports: [report]});
            } else {
                layout[dragTarget.row].reports.forEach(v => v.width = '*');
                layout[dragTarget.row].reports.splice(dragTarget.cell + 1, 0, report);
            }
            layout = layout.filter(v => v.reports.length !== 0);
            this.props.setLayout(layout);
        }
        this.setState({dragInfo: null, dragRect: null, dragDelta: null, dragTarget: null});
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

    static getDragTargetInfo(event) {
        let target = event.target;
        if (target.attributes['data-position']) {
            let dragInfo = target.attributes['data-position'].value;
            if (target.attributes['data-is-report']) {
                dragInfo = Main.parseDataPositionAttribute(dragInfo);
                let x = event.clientX - target.offsetLeft;
                let y = event.clientY - target.offsetTop;
                let w = target.offsetWidth;
                let h = target.offsetHeight;
                let westSouth = x * h < y * w;
                let eastSouth = (w - x) * h < y * w;
                if (westSouth) {
                    if (eastSouth) { //south
                        return dragInfo.row.toString();
                    } else { //west
                        return dragInfo.row + ',' + (dragInfo.cell - 1);
                    }
                } else {
                    if (eastSouth) { //east
                        return dragInfo.row + ',' + dragInfo.cell;
                    } else { //north
                        return (dragInfo.row - 1).toString();
                    }
                }
            } else {
                return dragInfo;
            }
        }
        return null;
    }

    resizeCellWidth(eventX) {
        let dragInfo = this.state.dragInfo;
        let minWidth = this.calculateTotalWidth(dragInfo.row, dragInfo.cell);
        let maxWidth = this.calculateTotalWidth(dragInfo.row, dragInfo.cell + 2);
        let width = eventX - this.screenLeft - this.state.dragDelta[0];
        if (width < minWidth + RESIZE_MIN_SIZE) {
            width = minWidth + RESIZE_MIN_SIZE;
        }
        if (width > maxWidth - RESIZE_MIN_SIZE) {
            width = maxWidth - RESIZE_MIN_SIZE;
        }
        let layout = JSON.parse(JSON.stringify(this.props.layout));
        layout[dragInfo.row].reports[dragInfo.cell].width = (width - minWidth) * 100 / (this.screenWidth - RESIZE_BAR_SIZE);
        layout[dragInfo.row].reports[dragInfo.cell + 1].width = (maxWidth - width) * 100 / (this.screenWidth - RESIZE_BAR_SIZE);
        this.props.setLayout(layout);
    }

    resizeRowHeight(eventY) {
        let dragInfo = this.state.dragInfo;
        let minHeight = this.calculateTotalHeight(dragInfo.row);
        let maxHeight = this.calculateTotalHeight(dragInfo.row + 2);
        let height = eventY - this.screenTop - this.state.dragDelta[1];
        if (height < minHeight + RESIZE_MIN_SIZE) {
            height = minHeight + RESIZE_MIN_SIZE;
        }
        if (height > maxHeight - RESIZE_MIN_SIZE) {
            height = maxHeight - RESIZE_MIN_SIZE;
        }
        let layout = JSON.parse(JSON.stringify(this.props.layout));
        layout[dragInfo.row].height = (height - minHeight) * 100 / (this.screenHeight - RESIZE_BAR_SIZE);
        layout[dragInfo.row + 1].height = (maxHeight - height) * 100 / (this.screenHeight - RESIZE_BAR_SIZE);
        this.props.setLayout(layout);
    }

    calculateTotalHeight(rowIndex) {
        let result = 0;
        for (let i = 0; i < rowIndex; i++) {
            let height = this.props.layout[i].height;
            result += height === '*' ? (this.screenHeight - RESIZE_BAR_SIZE) / this.props.layout.length : height * (this.screenHeight - RESIZE_BAR_SIZE) / 100;
        }
        return result;
    }

    calculateTotalWidth(rowIndex, cellIndex) {
        let result = 0;
        for (let i = 0; i < cellIndex; i++) {
            let width = this.props.layout[rowIndex].reports[i].width;
            result += width === '*' ? (this.screenWidth - RESIZE_BAR_SIZE) / this.props.layout[rowIndex].reports.length : width * (this.screenWidth - RESIZE_BAR_SIZE) / 100;
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