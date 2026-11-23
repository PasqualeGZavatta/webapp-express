import express from "express";
import charactersRouter from "./routes/charactersRouter.js";
import errorsHandler from "./middlewares/errorsHandler.js";
import notFound from "./middlewares/notFound.js";
//COSTANTI

const app = express();
//vedi se nell'env l'APP_PORT c'è e si potra collegare senno prendi la 3000
const port = process.env.APP_PORT || 3000;

//MIDDLEWARES

//intercetta le richieste HTTP e converte il body che arriva in json in un oggetto JS che possiamo prendere con req.body
app.use(express.json());
app.use("/characters", charactersRouter);

//ROUTES
app.get("/", (req, res) => {
  res.send("Homepage");
});

//ERROR MIDDLEWARES
app.use(errorsHandler);
app.use(notFound);

//LISTNER
app.listen(port, () => {
  console.log("Server aperto al link http://localhost:" + port);
});
