
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID
// const password  = "2b_$mSXgdsx#6Ef"; this password throw errors
const password = "user"; // now error removes


const uri = "mongodb+srv://organicUser:user@cluster0.z6ers.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.get('/', (req, res) => {
    // res.send({name:'kamal'})
    res.sendFile(__dirname + '/index.html')
})


// const MongoClient = require('mongodb').MongoClient;

client.connect(err => {
    const productCollection = client.db("organicdb").collection("products");

    
 // get data from your API 
    app.get('/products', (req,res) =>{
        productCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents)
        })
    })


    // add data in your API
    app.post("/addProduct", (req, res) => {
        const product = req.body;
        // console.log(product);
        productCollection.insertOne(product)
        .then( result => {
            console.log('data added successfully');
            res.send(result)
            res.redirect('/')
        })
    
        
    })

    // get a specific data from whole API
    app.get('/product/:id', (req,res) => {
        console.log(req.params.id);

        productCollection.find({ _id: ObjectId(req.params.id)})     
        .toArray( (err, documents) => {
            res.send(documents[0]);
        })
       
    })

    // update your data
    app.patch('/update/:id' , (req, res) => {
        // console.log(req.body.price);

        productCollection.updateOne(
            {_id: ObjectId(req.params.id)},
            {
                $set:{price: req.body.price, quantity: req.body.quantity}

            }
            )
            .then( result => {
                // console.log(result);
                res.send(result.modifiedCount > 0)
            })
        
    })


    //delete operation
    app.delete('/delete/:id', (req,res) =>{
        console.log(req.params.id);
            // perform actions on the collection object

        productCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then( (result) =>{
            // console.log(result);
            res.send(result.deletedCount > 0)
        })
    })

    console.log('database connected');
    //   client.close();
});


app.listen(3000, () => console.log("listening to localhost 3000"))