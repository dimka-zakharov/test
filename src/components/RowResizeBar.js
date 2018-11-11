import React from 'react';

const RowResizeBar = ({row, cursor}) => {
    return (
        <div data-position={row} className={'app-row-resize-bar'+(cursor?' app-row-resize-cursor':'')}/>
    );
};

export default RowResizeBar;

export const RESIZE_BAR_SIZE = 10;