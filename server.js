"use strict" //consocere errori su variabili
const jsfile = require('./scraper')

var express = require('express')
//var cors = require('cors')
var app = express();

//middleware
app.use(express.json());

//app.use(cors())
app.use(express.static('static'));

var dati = async () => {
    this.dati = await jsfile.scrape();
};
setInterval(async () => {
    this.dati = await jsfile.scrape();
    // console.table(this.dati.data)
}, 20000)

app.get('/api', (req, res) => {
    //console.log('get');
    if (this.dati) {
        //console.log('dati salvati')
        res.send(this.dati);
    } else {
        //console.log('dati scaricati')
        jsfile.scrape().then(data => {
            if (data){
                //console.log('nell if')
                res.send(data);
            }else{
                //console.log('else')
                res.status(404).send('errore');
            }
        })
    }

})
app.listen(80, function () {
    console.log('web server listening on port 80')
})