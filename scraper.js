const axios = require('axios');
const cheerio = require('cheerio');
const { find } = require('cheerio/lib/api/traversing');

async function scrape() {
    try {
        const res = await axios.get('https://www.lovevda.it/it/prima-di-partire/bollettino-neve-sci-fondo')
        const $ = await cheerio.load(res.data);

        //comprensori
        let comp = [];
        $('table tr').each((i, el) => {
            comp.push(
                $(el).find('a').text()
            )
        })
        let comprensori = comp.filter(Boolean);

        //scraping dei dati
        let data = [];
        const td = /<td>|<\/td>|\n|<br>/

        $('table').each((i, el) => {
            const datitab = $(el)
                .children()
                .last()
                .html()
                .split(td)
            data[i] = { dati: datitab }

        })

        const arr = JSON.stringify(data);

        //data di aggiornamento
        const regex = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g;
        let aggiornamento = regex.exec(arr);
        var i = 0;
        let update = [];

        while (aggiornamento) {
            const a = aggiornamento[0];
            update[i] = a;
            i++;
            aggiornamento = regex.exec(arr);
        }

        //ora di aggiornamento
        const regex0 = /[0-9]{2}:[0-9]{2}/g;
        let aggiornamento0 = regex0.exec(arr);
        var i = 0;
        let update_hour = [];

        while (aggiornamento0) {
            const a0 = aggiornamento0[0];
            update_hour[i] = a0;
            i++;
            aggiornamento0 = regex0.exec(arr);
        }

        //altezza neve
        const regex1 = /[0-9]+ cm/g;
        let aggiornamento1 = regex1.exec(arr);
        let dati1 = [];
        var i = 0;

        while (aggiornamento1) {
            const altneve = aggiornamento1[0];
            dati1[i] = altneve;
            i++;
            aggiornamento1 = regex1.exec(arr);
        }
        let alt_min = [];
        let alt_max = [];
        for (var i = 0; i < dati1.length; i += 2) {
            alt_min.push(dati1[i]);
        }
        for (var i = 1; i < dati1.length; i += 2) {
            alt_max.push(dati1[i]);
        }

        //tipo neve
        const regex2 = /compatta|ghiacciata|primaverile|farinosa|ghiacciata|bagnata|"-/gmi;
        let aggiornamento2 = regex2.exec(arr);
        let tiponeve = [];
        var i = 0;

        while (aggiornamento2) {
            const a2 = aggiornamento2[0];
            //console.log(tiponeve);
            tiponeve[i] = a2;
            i++
            aggiornamento2 = regex2.exec(arr);
        }

        //km piste aperte
        const regex3 = /"[0-9]+"|"[0-9]+,[0-9]+/g;
        let aggiornamento3 = regex3.exec(arr);
        let dati3 = [];
        var i = 0;

        while (aggiornamento3) {
            const piste = aggiornamento3[0].replace(/"/g, "").replace(",", ".");
            // console.log(piste);
            dati3[i] = piste;
            i++;
            aggiornamento3 = regex3.exec(arr);
        }
        let km_open = [];
        let km_tot = [];

        for (var i = 0; i < dati3.length; i += 2) {
            km_open.push(dati3[i]);
        }
        for (var i = 1; i < dati3.length; i += 2) {
            km_tot.push(dati3[i]);
        }
        // console.log(update, update_hour,alt_min,alt_max,tiponeve, km_open, km_tot)

        //creo il JSON
        let json = [];
        for (var j = 0; j < update.length; j++) {
            json.push({
                Comprensorio: comprensori[j],
                Aggiornamento: update[j],
                Ora_aggiornamento: update_hour[j],
                Neve_min: alt_min[j],
                Neve_max: alt_max[j],
                Tipo_neve: tiponeve[j],
                Piste_aperte: km_open[j],
                Tot_piste: km_tot[j]
            })
        }
        const jsonO = { "data": json };
        // var fs=require('fs')
        // fs.writeFile("./data.json",JSON.stringify(jsonO,null,2), err=>{
        //     if(err){
        //         console.log(err);
        //     }else{
        //         console.log('success');
        //     }
        // });

        return jsonO;
    } catch (e) {
        console.log('errore nello scraper');
        //console.error(e)
        return false;
    }



}
// scrape()

module.exports = { scrape };
