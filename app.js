const express = require("express");
const axios = require("axios");
const path = require("path");
const mongoose = require("mongoose");
const PetFact = require("./models/petfacts");

const app = express();
const PORT = 3000;

main().then(() =>
    console.log("DataBase connected Successfully."))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/petfacts');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Render Home Page
app.get("/", (req, res) => {
    res.render("index", { petImage: "", petFact: "Click 'Generate' to get a fact!" });
});

// Dog API Route
app.get("/api/dog", async (req, res) => {
    try {
        const imgResponse = await axios.get("https://dog.ceo/api/breeds/image/random");
        const factResponse = await axios.get("https://dogapi.dog/api/v2/facts");

        res.json({
            petImage: imgResponse.data.message,
            petFact: factResponse.data.data[0].attributes.body,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ petImage: "", petFact: "Could not fetch fact. Try again!" });
    }
});

app.get("/api/cat", async (req, res) => {
    try {
        const imgResponse = await axios.get("https://api.thecatapi.com/v1/images/search");
        const factResponse = await axios.get("https://meowfacts.herokuapp.com/");

        res.json({
            petImage: imgResponse.data[0].url,
            petFact: factResponse.data.data[0],
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ petImage: "", petFact: "Could not fetch fact. Try again!" });
    }
});

app.post("/save/pet", async (req, res) => {

    const { petType, imageURL, fact } = req.body;

    const newpet = new PetFact({
        petType,
        imageURL,
        fact,
        created_At: new Date(),
    });

    try {
        await newpet.save();
        console.log("Data Saved");
        res.status(201).json({ message: "Pet data saved" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save pet data" });
    }
})

app.get("/saved",async (req,res) =>{
    try{
        const savedpet = await PetFact.find({});
        res.render("saved", { pets : savedpet });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "Failed to fetch saved pet data" });
    }
})

app.delete("/delete/:id", async (req,res)=>{
    const {id} = req.params;
    try{
        await PetFact.findByIdAndDelete(id);
        console.log("Data Deleted Successfully.");
        res.status(200).json({ message: "Pet data deleted" });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "Failed to delete pet data" });
    }
})

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));