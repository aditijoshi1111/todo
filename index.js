var express=require('express');
var fs=require('fs');

var app=express();

//TO USE EJS(Embedded Javascript Template)
app.set('view-engine',"ejs");

//Built-in Middleware function to recognize incoming
//element as array or objects. It is based on body-parser.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Middleware for css script files.. "./" coz all are in home
app.use(express.static('./'));


//Connect to mongoose
var mongoose=require('mongoose');
mongoose.connect("mongodb://localhost/my_tasks", {useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify: false});

mongoose.connection.once('open', ()=>{
    console.log("connected..");
}).on('error', ()=>{
    console.log("error.. can't connect");
});

var taskSchema= mongoose.Schema({
    task: String,
    status: Boolean
});

var Task=mongoose.model("Tasks", taskSchema);



//GET
app.get("/", function(res,req){
    Task.find(function(err,data){
        req.render('index.ejs', {todos: data});
    })
});

//POST
app.post("/addTask",function(req,res){
    var body=req.body;
    var newTask=new Task({
        task: body.item,
        status: body.status
    });
    newTask.save(function(err,data){
        if(err) console.log("error in adding Task: "+err);

        res.json(data);
    });
});

//DELETE
app.delete("/deleteTask/:task", function(req,res){
    Task.findOneAndRemove({task: req.params.task}, function(err, data){
        if(err) console.log("Error in deleting Task: "+err);
        
        res.json(data);
    });
});

//PUT
app.put("/checked", function(req,res){
    var body=req.body;
    if(body.status==true){
        Task.findOneAndUpdate({task: body.item}, {status: true}, function(err,data){
            if(err) console.log("Error in setting check true: "+err);

            res.json(data);
        })
    }
    else if(body.status==false){
        Task.findOneAndUpdate({task: body.item}, {status: false},function(err,data){
            if(err) console.log("Error in setting check false: "+err);

            res.json(data);
        })
    }
});

app.listen(8081);