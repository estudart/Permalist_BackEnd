import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";

const app = express();
const port = 5000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Es@16589231",
  port: 5432,
});
db.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

app.post("/add", async (req, res) => {
  console.log(req.body);
  const new_task = req.body.task;
  try {
    await db.query("INSERT INTO users_permalist (task) VALUES ($1)", [
      new_task,
    ]);
    res.status(200).send("Task added successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users_permalist");
    const tasks = result.rows;
    res.send(tasks);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/edit", async (req, res) => {
  try {
    const id = req.body.id;
    const new_text = req.body.text;
    const edited_task = await db.query(
      "UPDATE users_permalist SET task = $1 WHERE id = $2",
      [new_text, id]
    );
    res.status(200).send("Task updated successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/delete", async (req, res) => {
  try {
    const task = req.body.task;
    console.log(req.body);
    await db.query("DELETE FROM users_permalist WHERE task = $1", [task]);
    res.status(200).send("Task deleted successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
