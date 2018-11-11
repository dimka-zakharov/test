import React from 'react';

const RowResizeBar = ({row, cursor, dragging}) => {
    return (
        <div data-position={row} className={'app-row-resize-bar'+(cursor?' app-row-resize-cursor':'')+(dragging?' app-row-drag-target':'')}/>
    );
};

export default RowResizeBar;

export const RESIZE_BAR_SIZE = 10;