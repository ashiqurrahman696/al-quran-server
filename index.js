const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", async(req, res) => {
    res.send({
        message: "Server is running"
    });
});

app.get("/all-surahs/:lang", async(req, res) => {
    const { lang } = req.params;
    try {
        const response = await axios.get(`https://alquran-api.pages.dev/api/quran?lang=${lang}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: lang === "bn" ? "সূরার তালিকা লোড করতে ব্যর্থ" : "Failed to load list of surah", error: error.message });
    }
});

app.get("/surah/:surahId/:lang", async(req, res) => {
    const { surahId, lang } = req.params;
    try {
        if(surahId !== null){
            const response = await axios.get(`https://alquran-api.pages.dev/api/quran/surah/${surahId}?lang=${lang}`);
            res.json(response.data);
        }
    } catch (error) {
        res.status(500).json({ message:  lang === "bn" ? "সূরা লোড করতে ব্যর্থ" : "Failed to load surah", error: error.message });
    }
});

app.get("/surah/:surahId/verse/:verseId/:lang", async(req, res) => {
    const { surahId, verseId, lang } = req.params;
    try {
        if(surahId !== null){
            const response = await axios.get(`https://alquran-api.pages.dev/api/quran/surah/${surahId}/verse/${verseId}?lang=${lang}`);
            res.json(response.data);
        }
    } catch (error) {
        res.status(500).json({ message: lang === "bn" ? "আয়াত লোড করতে ব্যর্থ" : "Failed to load verse", error: error.message });
    }
});

app.get("/search/:search/:lang", async(req, res) => {
    const { search, lang } = req.params;
    try {
        if(search.length >= 3){
            if(search !== ""){
                const response = await axios.get(`https://alquran-api.pages.dev/api/quran/search?q=${search}&lang=${lang}`);
                res.json(response.data);
            }
            else{
                res.status(500).json({ message: lang === "bn" ? `${search} এর জন্য কোন ফলাফল পাওয়া যায়নি` : `No result found for ${search}`, error: error.message });
            }
        }
    } catch (error) {
        res.status(500).json({ message: lang === "bn" ? `Search query অবশ্যই কমপক্ষে ৩ অক্ষরের হতে হবে` : `Search query must be at least 3 characters`, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
});