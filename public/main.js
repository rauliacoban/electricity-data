let database_data = [];
const entry_keys = ['time', 'cons', 'prod', 'coal', 'gas', 'hydro', 'nuclear', 'wind', 'solar', 'biomass', 'sold'];

function getAverage(){
    let sum = {};
    for (key of entry_keys){
        sum[key] = 0;
    }
    for (row of database_data){
        for (key of entry_keys){
            if(key != 'time')
                sum[key] += row[key];
        }
    }
    let avg = {};
    for (key of entry_keys){
        if(key != 'time')
            avg[key] = Math.round(sum[key] / database_data.length);
    }
    
    return avg;
}

async function updateDatabase(){
    let data = {};

    const options = {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    const response = await fetch('/api', options);
    console.log(await response.json());
}

async function getData(){
    const response = await fetch('/api');
    const raw_json = await response.json();
    database_data = raw_json;

    for(i = 0; i < raw_json.length; i++){
        for(key of entry_keys){
            if(key == 'time')
            {
                const date = new Date(raw_json[i][key])
                database_data[i][key] = date.getSeconds();
            }
            else
                database_data[i][key] = parseInt(raw_json[i][key]);
        }
    }
}

const ctx = document.getElementById('daily-pie-cons').getContext('2d');
const daily_pie_cons = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['coal', 'gas', 'hydro', 'nuclear', 'wind', 'solar', 'biomass', 'sold'],
        datasets: [{
            label: 'Breakdown of consumed power by source',
            data: [1, 1, 1, 1, 1, 1, 1, 1],
            backgroundColor: [
                'rgba(0, 0, 0, 1)',
                'rgba(255, 220, 97, 1)',
                'rgba(32, 77, 193, 1)',
                'rgba(213, 34, 34, 1)',
                'rgba(55, 154, 60, 1)',
                'rgba(255, 255, 0, 1)',
                'rgba(124, 103, 83, 1)',
                'rgba(245, 15, 204, 1)'
            ]
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function updatePie()
{
    daily_pie_cons.data.datasets[0].data = Object.values(getAverage()).slice(2);
}

async function to_do()
{
    await getData();
    updatePie();
}

to_do()