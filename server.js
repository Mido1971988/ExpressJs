const express = require("express")
const app = express();
const path = require('path');
const cors = require("cors")
const logEvents = require("./middleware/logEvents")
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

// 3rd party Middleware cors in server.js
const allowedDomains = ['https://www.google.com', 'http://127.0.0.1:5500', 'http://localhost:3500'];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedDomains.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// custom Middleware logger
app.use(logger)
// app.use((req,res,next)=>{
//     logEvents(`${req.method}\t${req.headers.origin}\t${req.url}` , "reqLog.txt")
//     console.log("Custom MiddleWare")
//     next()
// })


// built-in Middleware to handle urlencoded data
app.use(express.urlencoded({ extended: false}))

// Built-in Middleware for json
app.use(express.json())

// Built-in Middleware fot serve static files ( like css , images )
app.use(express.static(path.join(__dirname, "/public" )))

app.get("^/$|/index(.html)?", (req,res) =>{ 
    // res.send("Hello World");
    // res.sendFile("./views/index.html", { root : __dirname}) // we added root so express knows ./ is you root directory
    res.sendFile(path.join(__dirname, "views" , "index.html"))
})

app.get("/new-page(.html)?", (req,res) =>{
    res.sendFile(path.join(__dirname, "views" , "new-page.html"))
})

// redirect
app.get("/old-page(.html)?", (req,res) =>{
    res.redirect(301 , "/new-page.html")
})

// Route Hanlder 
app.get("/hello(.html)?", (req,res,next) =>{
    console.log("will Load hello.html after next()")
    next()
}, (req,res)=>{
    res.send("Hello World")
})

// chained 
const one = (req,res,next) => {
    console.log("one")
    next()
}

const two = (req,res,next) => {
    console.log("two")
    next()
}

const three = (req,res,next) => {
    console.log("three")
    res.send("Chain Page")
}

app.get("/chain(.html)?" , [one , two , three])

// custom 404 page
app.get("/*", (req,res) =>{
    res.status(404).sendFile(path.join(__dirname , "views" , "404.html"))
})

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));