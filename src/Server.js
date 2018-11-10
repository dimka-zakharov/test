const express = require('express');
const app = express();
const port = 8081;

app.get('/', (request, response) => {
    response.send('Hello from Express!');
});

app.get('/accounts', (request, response) => {
    response.send(['bmw', 'audi', 'honda']);
});


app.get('/layout', (request, response) => {
    response.send([
        {
            height: '*',
            reports:
                [
                    {id: 1, width: '30%', report: 'report1'},
                    {id: 2, width: '20%', report: 'report2'},
                    {id: 3, width: '50', report: 'report3'}
                ]
        },
        {
            height: '*',
            reports: [
                {id: 4, width: '*', report: 'report4'},
            ]
        }
    ]);
});


app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
});