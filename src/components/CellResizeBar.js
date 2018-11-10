import React from 'react';

const CellResizeBar = ({row, cell}) => {
    return (
        <div data-position={[row, cell]} className='app-cell-resize-bar'/>
    );
};

export default CellResizeBar;