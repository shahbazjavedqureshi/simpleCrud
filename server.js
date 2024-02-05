// server.js


const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()


MongoClient.connect('mongodb+srv://shahbazjawaid2:BYUwSqe8weYzFFul@cluster0.khpe5pb.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')


        app.set('view engine', 'ejs')
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json())
       
        app.use(express.static('public') )


     
       
        app.get('/', (req, res) => {
            
            db.collection('quotes').find().toArray()
                .then(quotes => {
                res.render('index.ejs', { quotes: quotes })

            })
                .catch(error => console.log(error))
        })


        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    console.log(result)
                    res.redirect('/');
                })
                .catch(error => console.error(error));
        })
       


   app.put('/quotes', (req, res) => {
    quotesCollection.findOneAndUpdate(
        { name: 'Yoda' },
        {
            $set: {
                name: req.body.name,
                quote: req.body.quote
            }
        },
        {
            upsert: true
        }
    )
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
})

    app.delete('/quotes', (req, res) => {
    quotesCollection.deleteOne(
        { name: req.body.name }
    )
        .then(result => {
            if (result.deleteCount === 0) {
                return res.json('No quote to delete')
            }
            res.json('Deleted Shahbaz\'s quote')
        })
        .catch(error => console.error(error))
    })



        const isProduction = process.env.NODE_ENV === 'production'
        const port = isProduction ? 7500 : 3000
        app.listen(port, function () {
            console.log(`listening on ${port}`)
        })
    })
    .catch(console.error)