var text=document.getElementById("right");

function key(event){

    if(event.keyCode === 13){
        event.preventDefault();
        if(text.value!=""){
            var request=new XMLHttpRequest();
            const c={item: text.value, status: false};

            request.open("POST","/addTask");
            request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            request.send(JSON.stringify(c));
            
            request.addEventListener("load", function(event){
                location.reload();
            })
        }

        text.value="";
        text.placeholder="I need to...";
    }

}

function deleteTask(e){
    var id=e.parentElement.parentElement.id;
    var e1=document.getElementById(id).firstElementChild.innerHTML;
    var ele={item: e1};
    console.log(e1);
    var request=new XMLHttpRequest();
    request.open("DELETE","/deleteTask/"+e1);
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send(JSON.stringify(ele));

    request.addEventListener("load", function(event){
        console.log(JSON.parse(event.target.responseText));
        location.reload();
    })
}

function workDone(e){
    var x=e.parentElement.parentElement.id;
    var y=document.getElementById(x).firstElementChild;
    
    var request=new XMLHttpRequest();
    if(e.checked==true){
    y.style.textDecoration="line-through";
    }
    else{
    y.style.textDecoration="none";
    }
    var c={item: y.innerHTML, status: e.checked};
    request.open("PUT","/checked");
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify(c));
}