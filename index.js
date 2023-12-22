const express = require('express')
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
// app.use(
//   cors({
//       origin: ['http://localhost:5173', 'https://enmmedia.web.app'],
//       credentials: true,
//   }),
// )
app.use(express.json());



const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ei0qpxt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    const taskCollection = client.db("taskDb").collection("task");
    const featureCollection = client.db("taskDb").collection("feature");
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    app.get('/task', async(req, res) => {
        const email = req.query?.email;
        let  query = {};
        if(email){
           query = {email: email}
        }
      const result = await taskCollection.find(query).toArray();
        res.send(result)
    })

     //single data get
     app.get("/task/:id", async(req, res)=>{
      const id = req.params.id;
     // console.log(id);
       const query= {_id:new ObjectId(id)}
       const result = await taskCollection.findOne(query)
      res.send(result)

  })
    app.post('/task/create-task', async(req, res) => {
        const product = req.body; console.log(product);
        const result = await taskCollection.insertOne(product);
         res.send(result);
    })

    app.post('/all-task', async(req, res) => {
      const deletedResult = await taskCollection.deleteMany();
      console.log(deletedResult);
      const product = req.body; console.log(product);
      const result = await taskCollection.insertMany(product);
       res.send(result);
  })

  app.put('/update-task/:id', async(req, res) => {
    const id =  req.params.id;
    console.log(id);
    //  const priority = form.priority.value
   // const deadline = form.deadline.value
         const updateJob = req.body;
         console.log(updateJob);
         const filter= {_id: new ObjectId(id)}
         const option = {upsert: true}
        const task = {
         $set: {
          title:updateJob.title,
          priority:updateJob.priority,
          deadline:updateJob.deadline,
           description:updateJob.description
          
          }
        }
        const result = await taskCollection.updateOne(filter, task, option)
        res.send(result)
  })
    app.delete('/task/:id',   async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/feature', async(req, res) => {
        
       const result = await featureCollection.find().toArray();
        res.send(result)
    })
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('taskFlowHub is setting')
  })
  app.listen(port, () => {
    console.log(`taskFlowHub is sitting on port:${port}`);
  })