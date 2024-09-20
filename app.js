import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
const app = express();
const port = 3000;


const db = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "tiger_trust_register",
    password: "Shaggypet2015",
    port: 5433
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

app.get("/", async(req,res) => {
    try {
        const result = await db.query("SELECT COUNT(*) FROM players WHERE is_present = true");
        const count = result.rows[0].present_count;
        res.render("index.ejs", {
            count: count
        })
    } catch (error) {
        
    }
    res.render("index.ejs",{
    });
})
db.query('SELECT 1', (err, res) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Database connection successful');
    }
});

app.post("/search", async (req,res) => {
    const {entry} = req.body;
    const names = entry.trim().split(" "); // removing the blank spaces infront and behind the word then splitting them by a space 
    const first_name = names[0]; // assiging the first element in the names array to first_name
    const last_name = names.slice(1).join(" "); // this combines the remaining parts of the name into one name to handle difficult last names
    console.log(first_name, last_name);
    try {
        //note that when searching data base for name use TRIM to ensure there are not blank spaces infront or behind the word
        const result = await db.query("SELECT * FROM players WHERE TRIM(first_name) = $1 AND TRIM(last_name) = $2", [first_name,last_name]);
        if(result.rows.length > 0 ){
            await db.query("UPDATE players SET is_present = TRUE WHERE TRIM(first_name) = $1 AND TRIM(last_name) = $2", [first_name,last_name]);
            res.send("Player marked as present");
        }else{
            res.status(404).send("Player not found in register");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error finding name in the register")
        
    }
    
})
app.get("/present", async (req,res) => {
    try {
        const result = await db.query("SELECT FROM players WHERE is_present = TRUE");
        res.render("present.ejs", {
            players: result.rows
        })
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retriving present players");
        
    }
})

app.listen(port, () =>{
    console.log(`Listening on port ${port}`)
});