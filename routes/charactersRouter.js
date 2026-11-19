import express from "express";

const router = express.Router();

//Index
router.get("/", (req, res) => {
  res.send("Lista dei personaggi D&D");
});

//Show
router.get("/:id", (req, res) => {
  res.send("Dettaglio del personaggio con id:" + req.params.id);
});

//Store
router.post("/", (req, res) => {
  res.send("Creazione del personaggio");
});

//Update
router.patch("/:id", (req, res) => {
  res.send("Modifica del personaggio con id:" + req.params.id);
});

//Destroy
router.delete("/:id", (req, res) => {
  res.send("Distruzione del personaggio con id:" + req.params.id);
});

export default router;
