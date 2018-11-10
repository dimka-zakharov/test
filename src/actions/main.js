export const setCurrentView = (viewName) => {
    return {
        type: 'SET_CURRENT_VIEW',
        payload: viewName
    };
};

export const addReport= (name) => {
    return {
        type: 'ADD_REPORT',
        payload: name
    };
};

export const setLayout = (layout) => {
    return {
        type: 'SET_LAYOUT',
        payload: layout
    };
};