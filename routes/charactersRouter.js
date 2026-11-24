import express from "express";
import prisma from "../libs/prismaClient.js";
import notFound from "../middlewares/notFound.js";

const router = express.Router();

//Utilities

//creaiamo una costante sendError che ha come valore il Json dell'errore passando una funzione anonima con res, status e message come parametri
//cosi racchiudiamo i vari errori
const sendError = (res, status, message) =>
  res.status(status).json({
    error: message,
  });

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

//SHOW
router.get("/:id", async (req, res) => {
  //qui è req.param.id perchè devo leggere il parametro id dall'url. Non prisma

  const urlId = Number(req.params.id);

  //validazione id come numero intero positivo
  if (!Number.isInteger(urlId) || urlId <= 0) {
    return sendError(res, 400, "invalid character Id");
  }

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
      id: urlId,
    },
  });

  //validazione del 404 fa vatta DOPO aver passato prisma.character.findunique() perchè dobbiamo veder se il selecterd character esiste e non è nullo. NON l'urlId
  if (!characterSelected) {
    return sendError(res, 404, "Character not found");
  }

  res.status(200).json(characterSelected);
});

//STORE
router.post("/", async (req, res) => {
  const { charName, charLevel, charHp } = req.body;

  //EQUIVALENTE NON DESTRUTTURATO
  // const charName = req.body.name;
  // const charLevel = Number(req.body.level);
  // const charHp = Number(req.body.hp);

  //Validazioni:
  //il typeof andrebbe messo per primo

  if (
    typeof charName !== "string" ||
    !charName ||
    charName.trim().length === 0
  ) {
    return sendError(res, 400, "Invalid name Format");
  }

  if (charLevel <= 0 || !Number.isInteger(charLevel)) {
    return sendError(res, 400, "Invalid level number");
  }
  if (charHp <= 0 || !Number.isInteger(charHp)) {
    return sendError(res, 400, "Invalid Hp number");
  }

  const newCharacter = await prisma.character.create({
    data: {
      //qui è req.body.whatever perchè non li prendo dall'url ma da corpo della richiesta post
      name: charName.trim(),
      level: charLevel,
      hp: charHp,
    },
  });

  res.json(newCharacter);
  // res.send("Creazione del personaggio");
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
