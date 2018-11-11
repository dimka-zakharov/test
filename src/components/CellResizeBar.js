import React from 'react';

const CellResizeBar = ({row, cell, cursor, selected}) => {
    return (
        <div data-position={[row, cell]} className={'app-cell-resize-bar'+(cursor?' app-cell-resize-cursor':'') + (selected ? ' drag-target':'')}/>
    );
};

export default CellResizeBar;