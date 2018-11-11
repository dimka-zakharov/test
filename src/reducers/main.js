export default function main(state = getInitialState(), action) {
    switch (action.type) {
        case 'SET_CURRENT_VIEW':
            return Object.assign({}, state, {currentView: action.payload});
        case 'SET_LAYOUT':
            updateRowIds(action.payload);
            return Object.assign({}, state, {layout: action.payload});
        case 'ADD_REPORT_EMPTY_WIDTH':
            let newState = JSON.parse(JSON.stringify(state));
            if (!newState.layout[0]) {
                newState.layout.push({height: '*', reports: []});
            }
            let width = (100 / newState.layout[0].reports.length);
            newState.layout[0].reports.forEach(v => v.width = width);
            newState.layout[0].reports.push({id: getNextId(newState.layout), name: action.payload, width: '0'});
            return newState;
        case 'ADD_REPORT_FINAL':
            newState = JSON.parse(JSON.stringify(state));
            newState.layout[0].reports.forEach(v => v.width = '*');
            return newState;
        case 'DELETE_REPORT_EMPTY_WIDTH':
            newState = JSON.parse(JSON.stringify(state));
            let reports = newState.layout[action.payload[0]].reports;
            if (reports.length === 1) {
                newState.layout.forEach(v => v.height = 100 / (newState.layout.length - 1));
                newState.layout[action.payload[0]].height = 0;
            } else {
                reports.forEach(v => v.width = 100 / (reports.length - 1));
                reports[action.payload[1]].width = 0;
            }
            return newState;
        case 'DELETE_REPORT_FINAL':
            newState = JSON.parse(JSON.stringify(state));
            reports = newState.layout[action.payload[0]].reports;
            if (reports.length === 1) {
                newState.layout.splice(action.payload[0], 1);
            } else {
                reports.forEach(v => v.width = '*');
                reports.splice(action.payload[1], 1);
            }
            return newState;
        default:
            return state;
    }
}

function getNextId(layout) {
    let result = 0;
    layout.forEach(v => v.reports.forEach(w => result = Math.max(w.id + 1, result)));
    return result;
}

function getNextRowId(layout) {
    return layout.reduce((a, v) => v.id !== undefined ? Math.max(a, v.id + 1) : a, 0);
}

function updateRowIds(layout) {
    layout.forEach(v => {
        if (!v.id) {
            v.id = getNextRowId(layout);
        }
    });
}


function getInitialState() {
    let state = {
        currentView: '',
        layout: [
            {
                height: '*',
                reports: [
                    {id: 1, name: 'Delta', width: '*'},
                    {id: 2, name: 'Vega Grid', width: '*'}
                ]
            },
            {
                height: '*',
                reports: [
                    {id: 3, name: 'Vega Summary', width: '*'},
                    {id: 4, name: 'Vega Grid', width: '*'},
                    {id: 5, name: 'Vega Grid', width: '*'},
                    {id: 6, name: 'Vega Grid', width: '*'}
                ]
            },
            {
                height: '*',
                reports: [
                    {id: 7, name: 'Delta', width: '*'},
                    {id: 8, name: 'Vega Grid', width: '*'},
                    {id: 9, name: 'Vega Summary', width: '*'}
                ]
            }
        ]
    };
    updateRowIds(state.layout);
    return state;
}