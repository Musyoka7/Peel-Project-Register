import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
const app = express();
const port = 3000;


const db = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "**",
    password: "Shaggypet2015",
    port: 5432
});

const players = [
    {
        id: 1,
        name: "alex musyoka",


    },
    {
        id: 2,
        name: "alfred musyoka",

    },
    {
        id: 3,
        name: "abby nzivu",
    }
]
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req,res) => {
    res.render("index.ejs",{
    });
})
app.post("/search", (req,res) => {
    const name = req.body;
    if(players.includes(name))
    {
        res.render("index.ejs", {
            data: players
        })
    }
})

app.listen(port, () =>{
    console.log(`Listening on port ${port}`)
});