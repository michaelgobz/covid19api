const express = require('express')
const fs = require('fs');
const js2xmlparser = require('js2xmlparser');
const morgan = require('morgan')
const path = require('path')
const covid19ImpactEstimator = require('./estimator');
const bodyParser = require('body-parser');

const port = process.env.PORT || 7000;
const app = express();

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a', encoding: 'utf-8' })
// data
const data = {
    region: {
        name: "Africa",
        avgAge: 19.7,
        avgDailyIncomeInUSD: 5,
        avgDailyIncomePopulation: 0.71
    },
    periodType: "days",
    timeToElapse: 58,
    reportedCases: 674,
    population: 66622705,
    totalHospitalBeds: 1380614
} 

// body-perser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup the logger
const msgformat = ':method\t:url\t:status\t:response-time';
const logger = morgan(msgformat,
    {
        stream: {
            write(msg) {
                const finalUrl = msg.length - 1;
                const tabindex = msg.lastIndexOf('\t');
                const str = msg.substring(tabindex + 1, finalUrl);
                let timemodel = Math.ceil(parseInt(str));
                if (timemodel < 10) {
                    timemodel = `0${timemodel.toString()}`
                } else {
                   timemodel= timemodel.toString();
                }
                const log = `${msg.substring(0, tabindex + 1)}${timemodel}ms\n`;
                accessLogStream.write(log); 
            }
        }
    })
app.use(logger)

app.get('/', (req, res) => {
    res.send('welcome to Covid-19 API')
});

const post_data = { region: {}, };

app.post('/api/v1/on-covid-19', (req, res) => {
    post_data.region.name = req.body.region.name;
    post_data.region.avgAge = req.body.region.avgAge;
    post_data.region.avgDailyIncomeInUSD = req.body.region.avgDailyIncomeInUSD ;
    post_data.region.avgDailyIncomePopulation = req.body.region.avgDailyIncomePopulation;
    post_data.periodType = req.body.periodType;
    post_data.timeToElapse = req.body.timeToElapse;
    post_data.reportedCases = req.body.reportedCases;
    post_data.population = req.body.population;
    post_data.totalHospitalBeds = req.body.totalHospitalBeds;
    console.log(post_data);
    res.json(covid19ImpactEstimator(post_data))
});

app.post('/api/v1/on-covid-19/json', (req, res) => {
    res.set('content-Type', 'application/json');
    post_data.region.name = req.body.region.name;
    post_data.region.avgAge = req.body.region.avgAge;
    post_data.region.avgDailyIncomeInUSD = req.body.region.avgDailyIncomeInUSD;
    post_data.region.avgDailyIncomePopulation = req.body.region.avgDailyIncomePopulation;
    post_data.periodType = req.body.periodType;
    post_data.timeToElapse = req.body.timeToElapse;
    post_data.reportedCases = req.body.reportedCases;
    post_data.population = req.body.population;
    post_data.totalHospitalBeds = req.body.totalHospitalBeds;
    console.log(post_data);
    res.json(covid19ImpactEstimator(post_data))
});

app.post('/api/v1/on-covid-19/xml', (req, res) => {
    res.set('Content-Type', 'application/xml');
    post_data.region.name = req.body.region.name;
    post_data.region.avgAge = req.body.region.avgAge;
    post_data.region.avgDailyIncomeInUSD = req.body.region.avgDailyIncomeInUSD;
    post_data.region.avgDailyIncomePopulation = req.body.region.avgDailyIncomePopulation;
    post_data.periodType = req.body.periodType;
    post_data.timeToElapse = req.body.timeToElapse;
    post_data.reportedCases = req.body.reportedCases;
    post_data.population = req.body.population;
    post_data.totalHospitalBeds = req.body.totalHospitalBeds;
    console.log(js2xmlparser.parse('postData',post_data));
    res.send(js2xmlparser.parse('response', covid19ImpactEstimator(post_data)));
});
app.get('/api/v1/on-covid-19/logs', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(path.join(__dirname, 'access.log'))
})
//server listening
app.listen(port, () => {
    console.log(`api is running at port ${port}`)
})