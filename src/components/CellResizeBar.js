import React from 'react';

const CellResizeBar = ({row, cell, cursor, dragging}) => {
    return (
        <div data-position={[row, cell]} className={'app-cell-resize-bar'+(cursor?' app-cell-resize-cursor':'')+(dragging?' app-cell-drag-target':'')}/>
    );
};

export default CellResizeBar;