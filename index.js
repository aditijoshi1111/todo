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

//GET
app.get("/", function(res,req){
    fs.readFile('database.json','utf-8',function(err,dataRead){
        if(err) throw err;
        var dataTodo=JSON.parse(dataRead).data;

        req.render('index.ejs', {todos: dataTodo});
    });
});

//POST
app.post("/addTask",function(req,res){
    fs.readFile('database.json','utf-8',function(err,data1){
        if(err) throw err;
        var d=JSON.parse(data1);
        d.data.push(req.body);
        res.json(d);

        fs.writeFile('database.json',JSON.stringify(d),function(err){
            if(err) throw err;
        });
    });
});

//DELETE
app.delete("/deleteTask/:task", function(req,res){

     fs.readFile('database.json','utf-8',function(err,dataRead){
        if(err) throw err;
        var d=JSON.parse(dataRead);

        d.data=d.data.filter((todos)=>{
            return todos.item !== req.params.task;
        })
        res.json(d);

        fs.writeFile('database.json',JSON.stringify(d),function(err){
            if(err) throw err;
        })
     })
});

//PUT
app.put("/checked", function(req,res){
    fs.readFile('database.json','utf-8',function(err,dataRead){
        if(err) throw err;
        var d=JSON.parse(dataRead);

        for(var i=0;i<d.data.length;i++){
            if(d.data[i].item===req.body.item){
                d.data[i].status=req.body.status;
                break;
            }
        }

        fs.writeFile('database.json',JSON.stringify(d),function(err){
            if(err) throw err;
        })
    });
});

app.listen(8081);