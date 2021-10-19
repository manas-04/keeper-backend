const express = require("express");
require("dotenv").config();
const mongoose = require('mongoose');

const mongoDB = process.env.DB_URL ;
const db = mongoose.connect(mongoDB, { useNewUrlParser: true });

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

const noteSchema = new mongoose.Schema({
    notes:{
        type:Array,
    }
})
const noteModel = new mongoose.model('note',noteSchema);

app.get('/', (req,res) => {
    res.send(`<h1>Keeper app API running.</h1>`);
});

app.get(`/getData`, (req,res)=> {
    noteModel.findOne({id:"616ed89393aaeab1dd1d3db1"},(err,result)=>{
        if(err){
            return res.status(500).json({
                msg:"The server is not online."
            })
        }else{
            if(result){
                console.log(result);
                return res.status(200).json({
                    array:result.notes
                })
            }
        }
    })
})

app.post(`/updateElement`, (req,res)=> {
    // console.log(req.body.noteArray);
    noteModel.findOneAndUpdate(
        {id:"616ed89393aaeab1dd1d3db1"},
        {notes:req.body.noteArray},
        {new: true},
        (err,result)=>{
        if(err){
            return res.status(500).json({
                msg:"The server is not online."
            })
        }else{
            if(result){
                return res.status(200).json({
                    msg:"Everything went well."
                });
            }
        }
    })
})

db.then(connection => {
    if(connection){
        console.log("Server connected.");
        app.listen( process.env.PORT || 4000,function(){
            console.log("Server listening at port 4000.");
        });
    }
}).catch(err => {
    console.log(err);
});


