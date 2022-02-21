const DATABASE_FILENAME = 'database.db'
const PORT = 3000

const express = require('express');
const app = express();
const Datastore = require('nedb');
const {spawn} = require('child_process');


app.listen(PORT, () => console.log(`Listening at port ${PORT}`));
//app.use(express.static('public'));
app.use(express.json({
    limit: '1mb'
}));

const database = new Datastore(DATABASE_FILENAME);
database.loadDatabase();

app.get('/api', (request, response) =>{
    const python = spawn('python', ['main.py']);
    python.stdout.on('data', (data) =>{
        console.log('Pipe data from python script ...');
        data_string = data.toString().trim()
        //console.log(data_string);
        const rows = data_string.split('\n');
        rows.forEach(row => {
            
            console.log('--------------------------------------------------------------------------------------------------------------------------------');
            const data_done = JSON.parse(row);
            console.log(data_done);
            database.insert(data_done);
        });
    });
});