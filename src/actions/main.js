export const setCurrentView = (viewName) => {
    return {
        type: 'SET_CURRENT_VIEW',
        payload: viewName
    };
};

export const addReport = function (name) {
    return (dispatch) => {
        dispatch({
            type: 'ADD_REPORT_EMPTY_WIDTH',
            payload: name
        });
        setTimeout(() => {
            dispatch({
                type: 'ADD_REPORT_FINAL',
                payload: name
            });
        }, 0);
    }
};

export const deleteReport = (row, cell) => {
    return (dispatch) => {
        dispatch({
            type: 'DELETE_REPORT_EMPTY_WIDTH',
            payload: [row, cell]
        });
        setTimeout(() => {
            dispatch({
                type: 'DELETE_REPORT_FINAL',
                payload: [row, cell]
            });
        }, 150);
    }
};

export const setLayout = (layout) => {
    return {
        type: 'SET_LAYOUT',
        payload: layout
    };
};