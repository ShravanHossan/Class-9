const axios = require('axios');
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((request, response, next) => {
    var time = new Date().toString();
    // console.log(`${time}: ${request.method} ${request.url}`);
    var log = `${time}: ${request.method} ${request.url}`;
    fs.appendFile('server.log', log + '\n', (error) => {
        if (error) {
            console.log('Unable to log message');
        }
    });
    next();

});

app.use((request, response, next) => {
    response.render('maintenance.hbs');
    next();
});
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('message', (text) => {
    return text.toUpperCase();
});

var countrycode = "CAD";
var amount = 20;

hbs.registerHelper('exchange_output', async () => {


    // console.log("maybe here");
    await getExchangeRate(countrycode, amount).then((result) => {



        return `${amount} ${countrycode} is worth ${result[1]} PLN / ${result[2]} CAD \n You can spend it in the following countries: ${result[0]}`
        // return (`${amount} ${countrycode} is worth ${result[1]} PLN / ${result[2]} CAD \n You can spend it in the following countries: ${result[0]}`)

    }).catch((err) => {


        return err
    });

});


app.get('/', (request, response) => {
    response.render('home.hbs', {
        title: "Home page",
        welcome: 'Hello!',
        intro: 'In accordance with the Economics\'s handbook',
        link1: '/about',
        link1_text: 'About Me',
        link2: '/exchange',
        link2_text: 'Exchange Page'
    });
});

app.get('/about', (request, response) => {
    response.render('about.hbs', {
        title: "About me",
        intro: 'In accordance with the Economics\'s handbook',
        link1: '/',
        link1_text: 'Home Page',
        link2: '/exchange',
        link2_text: 'Exchange Page',
    });
});

app.get('/exchange', (request, response) => {

    response.render('exchange.hbs', {
        title: "Exchange me",
        intro: 'In accordance with the Economics\'s handbook',
        link1: '/',
        link1_text: 'Home Page',
        link2: '/about',
        link2_text: 'About me',
    });
});






var getExchangeRate =  (countrycode, amount) => {
    // console.log('here');
    return new Promise(( async (resolve, reject) => {

        try {
            var exchange_rate = await axios.get(`https://api.exchangeratesapi.io/latest?base=${countrycode}`);
        } catch (e) {
            if ( typeof amount != 'number'){
                reject("Is not a number and Bad country name")
            }else
                reject("Bad country code");
            // throw new Error("BAD Country");

        }
        if ( typeof amount != 'number'){
            reject("Is not a number")
        }


        var counties = axios.get(`https://restcountries.eu/rest/v2/currency/${countrycode}`);
        var list = [];


        counties.then((counties) => {
            for (i in counties.data) {
                list.push(counties.data[i].name);
            }

                var rates = exchange_rate.data.rates;

                var rate = [];
                rate.push(list.join());
                rate.push((rates.PLN * amount).toFixed(2));
                rate.push((rates.CAD * amount).toFixed(2));
                console.log(rate);

                // console.log(rate[2]);                resolve(rate);
                resolve(rate)
            }).catch( (err) => {
                reject(err)
        });

    }));
};

// app.get('/exchange.hbs', (request, response) => {
// getExchangeRate(countrycode, amount).then((result) => {
//
//     response.send(`${amount} ${countrycode} is worth ${result[1]} PLN / ${result[2]} CAD \n You can spend it in the following countries: ${result[0]}`)
// }).catch((err) => {
//     // console.log(err);
//     response.send(err)
// });
// });
app.listen(8080, () => {
    console.log('Server is up on the port 8080');
});

