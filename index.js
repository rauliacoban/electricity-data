const DATABASE_FILENAME = 'database.db'
const PORT = 3000
const SCRAPER_FILENAME = 'scraper.py'

const express = require('express');
const app = express();
const Datastore = require('nedb');
const {spawn} = require('child_process');


app.listen(PORT, () => console.log(`Listening at port ${PORT}`));
app.use(express.static('public'));
app.use(express.json({
    limit: '1mb'
}));

const database = new Datastore(DATABASE_FILENAME);
database.loadDatabase();

app.get('/api', (request, response) =>{
    
});

app.post('/api', (request, response) =>{
    response.text = '';

    const python = spawn('python', [SCRAPER_FILENAME]);
    python.stdout.on('data', (data) =>{
        const data_string = data.toString().trim()
        const rows = data_string.split('\n');

        rows.forEach(row => {
            
            console.log('--------------------------------------------------------------------------------------------------------------------------------');
            const data_done = JSON.parse(row);
            console.log(data_done);

            database.find({time: data_done.time}, (err, results) =>{
                if(results.length)
                {
                    //response.text.concat(`entry at ${data_done.time} already in database`);
                }
                else
                    database.insert(data_done);    
            });
        });
    });

    response.json({
        status: 'success'
    });
});
