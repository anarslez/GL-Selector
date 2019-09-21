const port = 6969;
var express = require('express');
var app = express();
var bodyParser = require("body-parser")
var session = require('express-session');
var path = require("path")
app.use(express.static(path.join(__dirname, "./Frontend/public/dist/public")))
app.use(bodyParser.json())
app.use(session({
    secret: 'LoginReg',
    resave: false,
    saveUninitialized: true,
}));
app.get('/session', function(req,res){
    let message = ''
    if(req.session.token === undefined){
        req.session.token = 0
    }
    else if(req.session.token === -1){
        message = 'You have been logged out due to inactivity'
        console.log(message)
    }
    console.log(req.session.token)
    res.json({token: req.session.token, message: message})
})
app.post('/session', function(req,res){
    req.session.token = req.body.token;
    res.json({token: req.session.token})
})
app.delete('/session', function(req,res){
    console.log('Gunna')
    delete req.session.token;
    res.json({token: 0})
})
app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./Frontend/public/dist/public/index.html"))
});
app.listen(port, function() {
    console.log("listening on port", port);
})