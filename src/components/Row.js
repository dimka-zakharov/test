import React from 'react';
import {RESIZE_BAR_SIZE} from "./RowResizeBar";
import Cell from './Cell.js';
import CellResizeBar from './CellResizeBar.js';

const Row = ({row, rowIndex, animated, total}) => {
    let height = 'calc(' + (row.height === '*' ? 100 / total : row.height) + '% - ' + RESIZE_BAR_SIZE + 'px)';
    let cells = [];
    row.reports.forEach((v, i) => {
        if (i > 0) {
            cells.push(<CellResizeBar row={rowIndex} cell={i-1} key={-i}/>);
        }
        cells.push(<Cell row={rowIndex} cell={i} report={v} animated={animated} key={v.id} total={row.reports.length}/>)
    });
    return (
        <div className={'app-row'+(animated?' app-transition':'')} style={{height: height, width: 'calc(100% - 10px)'}}>
            {cells}
        </div>
    );
};

export default Row;