const express = require('express');
const path = require('path')
const mongoose = require('mongoose')
const Todo = require('./models/todo')
// console.log('Todo require =>', Todo)

const app = express();


mongoose.connect('mongodb://localhost:27017/mydb')

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

app.get('/api/get' , async(req, res)=>{
    const record = await Todo.find({})

    return res.status(200).send(record)
})

app.post('/api/create' , async(req, res)=>{
    const record = req.body;
    await Todo.create(record)

    console.log(record.record + " was created")
    return res.status(200).send(record)
})

app.put('/api/modify' , async(req, res)=>{
    const {old: oldTitle, new: newTitle} = req.body

    const response = await Todo.updateOne(
        {
            record : oldTitle
        },{
            $set: {
                record: newTitle
            }
        }
    )
    
    console.log(`${oldTitle} was changed to ${newTitle} `)
    return res.status(200).send(response)
})

app.delete('/api/delete', async(req, res)=>{
    const {record} = req.body
    
    const response = await Todo.deleteOne({record})
    
    console.log(record + " was delete");
    return res.status(200).send(response)
})

const PORT = 3000;
app.listen(PORT , ()=>console.log(`Server is running on port ${PORT}`))