import React from 'react';
import {RESIZE_BAR_SIZE} from "./RowResizeBar";

const Cell = ({row, cell, report, total}) => {
    let width = 'calc(' + (report.width === '*' ? 100 / total : report.width) + '% - ' + RESIZE_BAR_SIZE + 'px)';
    return (
        <div data-position={[row, cell-1]} data-is-report={true} className='app-cell' style={{width: width}}>
            {report.name}
        </div>
    );
};

export default Cell;