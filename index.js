const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 4000;
//middelware

app.use(cors());
app.use(express.json());

//api
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zobm7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
async function run() {
    try {
        await client.connect();
        const todoList = client.db("todos").collection("todolist");
        console.log("database");

        app.get("/todo", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = todoList.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.post("/todo", async (req, res) => {
            const newItem = req.body;
            const result = await todoList.insertOne(newItem);
            res.send(result);
        });
        //delete one api
        app.delete("/todo/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await todoList.deleteOne(query);
            res.send(result);
        });

        app.put("/todo/:id", async (req, res) => {
            const user = req.body;

            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const updateDoc = { $set: { status: user.status } };
            const result = await todoList.updateOne(
                query,

                updateDoc
            );
            res.send(result);
        });
    } finally {
    }
}
run().catch(console.dir());
// perform actions on the collection object

app.get("/", (req, res) => {
    res.send("server is running");
});
//listen to port
app.listen(port, () => {
    console.log("listening to port" + port);
});