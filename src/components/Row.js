import React from 'react';
import {RESIZE_BAR_SIZE} from "./RowResizeBar";
import Cell from './Cell.js';
import CellResizeBar from './CellResizeBar.js';

const Row = ({row, rowIndex, animated, cursor, dragging, total}) => {
    let height = 'calc(' + (row.height === '*' ? 100 / total : row.height) + '% - ' + RESIZE_BAR_SIZE + 'px)';
    let cells = [];
    row.reports.forEach((v, i) => {
        cells.push(<Cell row={rowIndex} cell={i} report={v} animated={animated} key={v.id} total={row.reports.length}/>);
        cells.push(<CellResizeBar row={rowIndex} cursor={cursor && i !== row.reports.length-1} dragging={dragging} cell={i} key={-i - 1}/>);
    });
    return ([
        <div className={'app-row' + (animated ? ' app-transition' : '')} style={{width: '100%', height: height}}>
            <CellResizeBar row={rowIndex} cell={-1} dragging={dragging} key={0}/>
            <div className={'app-row'} style={{height: '100%', width: '100%'}}>
                {cells}
            </div>
        </div>
    ]);
};

export default Row;