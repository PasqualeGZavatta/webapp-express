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
export async function update(req, res) {}

//DESTROY
export async function destroy(req, res) {}

export default sendError;
