const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const routes = require('./routes');
dotenv.config();
const path = require("path");
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// Routes
app.use('/api', routes);
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.get('/', function (req, res) {
    res.send('Hello from Express API!');
})

app.listen(PORT, () => {
    console.log("Express API running in port : " + PORT);
});

module.exports = app;