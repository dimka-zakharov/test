export default function main(state = getInitialState(), action) {
    switch (action.type) {
        case 'SET_CURRENT_VIEW':
            return Object.assign({}, state, {currentView: action.payload});
        case 'SET_LAYOUT':
            return Object.assign({}, state, {layout: action.payload});
        case 'ADD_REPORT':
            let newState = JSON.parse(JSON.stringify(state));
            newState.layout[0].reports.forEach(v => v.width = '*');
            newState.layout[0].reports.push({id: 1, name: action.payload, width: '*'});
            return newState;
        default:
            return state;
    }
}

function getInitialState1() {
    return {
        currentView: '',
        layout: [
            {
                height: '*',
                reports: [
                    {id: 1, name: 'Delta', width: '*'},
                    {id: 1, name: 'Vega Grid', width: '*'}
                ]
            },
            {
                height: '*',
                reports: [
                    {id: 1, name: 'Vega Summary', width: '*'}
                ]
            }
        ]
    };
}

function getInitialState() {
    return {
        currentView: '',
        layout: [
            {
                height: '*',
                reports: [
                    {id: 1, name: 'Delta', width: '*'},
                    {id: 1, name: 'Vega Grid', width: '*'}
                ]
            },
            {
                height: '*',
                reports: [
                    {id: 1, name: 'Vega Summary', width: '*'},
                    {id: 1, name: 'Vega Grid', width: '*'},
                    {id: 1, name: 'Vega Grid', width: '*'},
                    {id: 1, name: 'Vega Grid', width: '*'}
                ]
            },
            {
                height: '*',
                reports: [
                    {id: 1, name: 'Delta', width: '*'},
                    {id: 1, name: 'Vega Grid', width: '*'},
                    {id: 1, name: 'Vega Summary', width: '*'}
                ]
            }
        ]
    };
}