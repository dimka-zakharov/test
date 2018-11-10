export const setCurrentView = (viewName) => {
    return {
        type: 'SET_CURRENT_VIEW',
        payload: viewName
    };
};

export const setLayout = (layout) => {
    return {
        type: 'SET_LAYOUT',
        payload: layout
    };
};