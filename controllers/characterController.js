import prisma from "../libs/prismaClient.js";

//Utilities

const sendError = (res, status, message) =>
  //creaiamo una costante sendError che ha come valore il Json dell'errore passando una funzione anonima con res, status e message come parametri
  //cosi racchiudiamo i vari errori
  res.status(status).json({
    error: message,
  });

//INDEX
export async function index(req, res) {
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
}

//SHOW
export async function show(req, res) {
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
}

//STORE
export async function store(req, res) {
  const { name, level, hp } = req.body;

  //EQUIVALENTE NON DESTRUTTURATO
  // const charName = req.body.name;
  // const charLevel = Number(req.body.level);
  // const charHp = Number(req.body.hp);

  //Validazioni:
  //il typeof andrebbe messo per primo

  if (typeof name !== "string" || !name || name.trim().length === 0) {
    return sendError(res, 400, "Invalid name Format");
  }

  if (level <= 0 || !Number.isInteger(level)) {
    return sendError(res, 400, "Invalid level number");
  }
  if (hp <= 0 || !Number.isInteger(hp)) {
    return sendError(res, 400, "Invalid Hp number");
  }

  const newCharacter = await prisma.character.create({
    data: {
      //qui è req.body.whatever perchè non li prendo dall'url ma da corpo della richiesta post
      name: name.trim(),
      level,
      hp,
    },
  });

  res.json(newCharacter);
}

//UPDATE
export async function update(req, res) {
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
}

//DESTROY
export async function destroy(req, res) {
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
}

export default sendError;
