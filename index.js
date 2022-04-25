const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const jwt = require('jwt');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 520;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.humt7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db("geniusCar").collection("service");
        const orderCollection = client.db("geniusCar").collection("order");

        // AUTH
        app.post("/login", async(req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expireIn: "Id"
            });
          res.send({accessToken})  
        })

        // SERVICES API
        app.get("/service", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        });

        app.get("/service/:id", async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            // console.log(query);
            // console.log(ObjectId);
            res.send(service);
        })
        
        //POST
        app.post("/service", async(req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result)
        })

        // DELETE
        app.delete("/service/:id", async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })

        // Order Collection API

        app.get("/order", async(req, res) => {
            const email = req.query.email;
            const query = {email: email};
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        })

        app.post("/order", async(req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result)
        })
    }
    finally {

    }
}

run().catch(console.dir)



app.get("/", (req, res) => {
    res.send("Running Genius Car Services Server");
})

app.listen(port, () => {
    console.log("listening to the port ", port);
})