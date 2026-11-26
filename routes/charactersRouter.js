import express from "express";
import prisma from "../libs/prismaClient.js";
import sendError, {
  index,
  show,
  store,
} from "../controllers/characterController.js";

const router = express.Router();

//Utilities

//creaiamo una costante sendError che ha come valore il Json dell'errore passando una funzione anonima con res, status e message come parametri
//cosi racchiudiamo i vari errori

//Index
router.get("/", index);

//SHOW
router.get("/:id", show);

//STORE
router.post("/", store);

//UPDATE
router.patch("/:id", async (req, res) => {
  const urlId = Number(req.params.id);
  const { name, level, hp, raceId, classes } = req.body;

  //Validazioni:
  //id:
  if (!Number.isInteger(urlId) || urlId <= 0) {
    return sendError(res, 400, "Invalid Id number");
  }

  //campi del body
  //name
  // se non è undefined devo controllare che non sia vuoto o non sia diverso da string
  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      return sendError(
        res,
        400,
        "Invalid name type (must be a not Empty string)",
      );
    }
  }

  //level
  if (level !== undefined) {
    if (!Number.isInteger(level) || level <= 0) {
      return sendError(res, 400, "Invalid number type (must be a number > 0)");
    }
  }

  //hp
  //in futuro cambiare i valori di hp che siano come minimo l'hit die del primo elemento dell'array delle classi + modificatore costituzione
  if (hp !== undefined) {
    if (!Number.isInteger(hp) || hp <= 0) {
      return sendError(res, 400, "Invalid number type (must be a number > 0)");
    }
  }

  //raceId

  if (raceId !== undefined && raceId !== null) {
    if (!Number.isInteger(raceId) || raceId <= 0) {
      return sendError(res, 400, "Invalid raceid number");
    }

    const race = await prisma.race.findUnique({
      where: {
        id: raceId,
      },
      select: {
        name: true,
      },
    });
    if (!race) {
      return sendError(res, 404, "Race id not in the db");
    }
  }

  const changedCharacter = await prisma.character.update({
    data: {
      // vuol dire questo:
      // il campo ha inviato name nel body? è diverso quindi da undefined? se si allora metti name.trim()
      //se no undefined
      name: name !== undefined ? name.trim() : undefined,
      level,
      hp,
      raceId,
    },

    //ora voglio includere la tabella classes per ora
    include: {
      classes: {
        // della tabella classes SOLO il nome voglio che compaia

        //al momento non funziona perchè non ho ancora creato classi e vedremo poi come fare (spero)
        select: {
          name: true,
        },
      },
    },
    where: {
      id: urlId,
    },
  });

  res.json(changedCharacter);
});

//DESTROY
router.delete("/:id", async (req, res) => {
  const urlId = Number(req.params.id);

  if (!Number.isInteger(urlId) || urlId <= 0) {
    return sendError(res, 400, "Id non valido");
  }
  await prisma.character.delete({
    where: {
      id: urlId,
    },
  });

  res.sendStatus(204);
});

export default router;
