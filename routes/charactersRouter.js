import express from "express";
import prisma from "../libs/prismaClient.js";

const router = express.Router();

//Index
router.get("/", async (req, res) => {
  const charactersList = await prisma.character.findMany({
    select: {
      id: true,
      name: true,
      race: true,
      classes: true,
      level: true,
    },
  });

  res.json(charactersList);
});

//Show
router.get("/:id", async (req, res) => {
  //qui è req.param.id perchè devo leggere il parametro id dall'url. Non prisma
  const id = req.params.id;

  //qui cerco il character unico(id)
  const characterSelected = await prisma.character.findUnique({
    select: {
      id: true,
      name: true,
      race: true,
      classes: true,
      level: true,
    },

    where: {
      id: id,
    },
  });

  // res.send("Dettaglio del personaggio con id:" + req.params.id);

  res.json(characterSelected);
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
