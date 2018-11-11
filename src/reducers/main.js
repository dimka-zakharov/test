export default function main(state = getInitialState(), action) {
    switch (action.type) {
        case 'SET_CURRENT_VIEW':
            return Object.assign({}, state, {currentView: action.payload});
        case 'SET_LAYOUT':
            saveLayout(action.payload);
            return Object.assign({}, state, {layout: action.payload});
        case 'ADD_REPORT':
            let newState = JSON.parse(JSON.stringify(state));
            if (!newState.layout[0]) {
                newState.layout.push({height: '*', reports: []});
            }
            newState.layout[0].reports.push({id: getNextId(newState.layout), name: action.payload});
            newState.layout[0].reports.forEach(v => v.width = '*');
            saveLayout(newState.layout);
            return newState;
        case 'DELETE_REPORT':
            newState = JSON.parse(JSON.stringify(state));
            let reports = newState.layout[action.payload[0]].reports;
            if (reports.length === 1) {
                newState.layout.splice(action.payload[0], 1);
                newState.layout.forEach(v => v.height = '*');
            } else {
                reports.splice(action.payload[1], 1);
                reports.forEach(v => v.width = '*');
            }
            saveLayout(newState.layout);
            return newState;
        default:
            return state;
    }
}

function getInitialState() {
    return  {
        currentView: '',
        layout: loadLayout() || [
            {
                height: '*',
                reports: [
                    {id: 1, name: 'Delta', width: '*'},
                ]
            },
            {
                height: '*',
                reports: [
                    {id: 2, name: 'Vega Grid', width: '*'},
                    {id: 3, name: 'Vega Summary', width: '*'},
                ]
            },
            {
                height: '*',
                reports: [
                    {id: 4, name: 'Delta', width: '*'},
                    {id: 5, name: 'Vega Grid', width: '*'},
                    {id: 6, name: 'Vega Summary', width: '*'}
                ]
            }
        ]
    };
}

function getNextId(layout) {
    let result = 0;
    layout.forEach(v => v.reports.forEach(w => result = Math.max(w.id + 1, result)));
    return result;
}

function saveLayout(layout) {
    localStorage.setItem('layout', JSON.stringify(layout));
}

function loadLayout() {
    return localStorage.getItem('layout') ? JSON.parse(localStorage.getItem('layout')) : null;
}