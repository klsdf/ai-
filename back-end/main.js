const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const PORT = 12345;

let app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
app.use(require("./router/aiSha.js").createServer(server));
