const express=require('express');
const app=express();
const http = require('http');
const server=require('http').Server(app);
const { Server } = require("socket.io");
const io = new Server(server);
var hbs=require('express-handlebars');
app. engine( 'hbs', hbs( { extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/' } ) );


app.set('view engine','hbs')
app.use(express.static('public'))
app.get('/',(req,res)=>{
    res.render('home');
})
app.get('/join',(req,res)=>{
    res.render('join-room');
    
})
const users = {};
io.on('connection',socket=>{
    socket.on('new-user-joined', name =>{ 
            console.log(name);
            users[socket.id] = name.toLowerCase() ;
            socket.broadcast.emit('user-joined', name);
        
    });
    socket.on('send',data=>{
        socket.broadcast.emit('recive',{message:data,name:users[socket.id]}) 
    });
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
    socket.on('onePerson',data=>{
        const name=data.name.toLowerCase() 
        const val=Object.keys(users).find(key => users[key] ===name)
        console.log(val);
        data.sendername=users[socket.id]
        console.log(data);
        io.to(val).emit('oneperson',data)
    })
})



server.listen(process.env.PORT || 3000,()=>{
    console.log("server started");
});