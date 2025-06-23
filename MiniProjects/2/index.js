import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render("index.ejs", { breweries: null, error: null });
});

app.get('/random', async (req, res) => {
  try {
    const response = await axios.get('https://api.openbrewerydb.org/v1/breweries/random');
    res.render("index.ejs", { breweries: response.data, error: null });
  } catch (error) {
    res.render("index.ejs", {
      breweries: null,
      error: 'Could not fetch a random brewery.',
    });
  }
});

app.post('/search', async (req, res) => {
  const { searchType, query } = req.body;

  let apiUrl;
  
  if (searchType === 'city') {
    apiUrl = `https://api.openbrewerydb.org/v1/breweries?by_city=${encodeURIComponent(query)}`;
  } else if (searchType === 'zip') {
    apiUrl = `https://api.openbrewerydb.org/v1/breweries?by_postal=${encodeURIComponent(query)}`;
  }

  try {
    console.log(req.body);
    const response = await axios.get(apiUrl);
    res.render("index.ejs", { breweries: response.data, error: null });
  } catch (error) {
    console.log("Failed to make request:", error.message);
    res.render("index.ejs", {
      breweries: null,
      error: 'Error. Please try again.',
    });
  }
});
