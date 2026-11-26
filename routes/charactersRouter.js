import express from "express";
import prisma from "../libs/prismaClient.js";
import sendError, {
  destroy,
  index,
  show,
  store,
  update,
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
router.patch("/:id", update);

//DESTROY
router.delete("/:id", destroy);

export default router;
