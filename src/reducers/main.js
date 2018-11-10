export default function main(state = getInitialState(), action) {
    switch (action.type) {
        case 'SET_CURRENT_VIEW':
            return Object.assign({}, state, {currentView: action.payload});
        case 'SET_LAYOUT':
            return Object.assign({}, state, {layout: action.payload});
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