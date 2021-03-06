import React, {Component} from 'react';
import '../App.css';
import {connect} from 'react-redux';
import {deleteReport} from '../actions/main';
import {RESIZE_BAR_SIZE} from "./RowResizeBar";

class Cell extends Component {
    constructor(props) {
        super(props);
        this.deleteReport = this.deleteReport.bind(this);
    }

    deleteReport() {
        this.props.deleteReport(this.props.row, this.props.cell);
    }

    render() {
        let {row, cell, report, total} = this.props;
        let width = 'calc(' + (report.width === '*' ? 100 / total : report.width) + '% - ' + RESIZE_BAR_SIZE + 'px)';
        return (
            <div data-position={[row, cell]} data-is-report={true} className='app-cell' style={{width: width}}>
                <label className="title-label">{report.name}</label>
                <button onClick={this.deleteReport} className="delete-button">x</button>
            </div>
        );
    };
}

const mapDispatchToProps = {deleteReport};

export default connect(null, mapDispatchToProps)(Cell);