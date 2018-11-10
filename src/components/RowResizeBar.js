import React from 'react';

const RowResizeBar = ({row}) => {
    return (
        <div data-position={row} className='app-row-resize-bar'/>
    );
};

export default RowResizeBar;

export const RESIZE_BAR_SIZE = 10;