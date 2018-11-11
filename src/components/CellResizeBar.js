import React from 'react';

const CellResizeBar = ({row, cell, cursor}) => {
    return (
        <div data-position={[row, cell]} className={'app-cell-resize-bar'+(cursor?' app-cell-resize-cursor':'')}/>
    );
};

export default CellResizeBar;