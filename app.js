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

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", async(req,res) => {
    try {
        const result = await db.query("SELECT COUNT(*) AS present_count FROM players WHERE is_present = TRUE");
        const count = result.rows[0].present_count || 0;
        console.log("Present Count:" + count);
        res.render("index.ejs", {
            count: count
        })
    } catch (error) {
        console.error(error);
        res.status(500).send("Error dispalying home page");
    }
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
            res.redirect("/");
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
        const result = await db.query("SELECT first_name, last_name FROM players WHERE is_present = TRUE");
        console.log("Full Result:", result);
        console.log(result.rows);
        res.render("present.ejs", {
            players: result.rows
        })
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retriving present players");
        
    }
})

app.post("/reset", async (req,res) => {
    try {
        await db.query("UPDATE players SET is_present = FALSE");
        console.log("All Players have been reset.")
        res.redirect("/");
    } catch (error) {
        res.status(500).send("Error resseting the attendance.")
    }
})

app.listen(port, () =>{
    console.log(`Listening on port ${port}`)
});