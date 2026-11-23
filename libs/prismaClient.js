import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/index.js";
import "dotenv/config";

//adapter -> oggetto (driver adapter) che  permette a Prisma di comunicare col server mariaDb
//PrismaMariaDb -> costruttore a cui passiamo l'Uròl del DB
const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

//primsa -> oggetto che fa interazioni/query  sul  db
//in pratica utilizza l'adapter  pper far comunicare PrismaClient con il server mariaDb tramite l'url
const prisma = new PrismaClient({
  adapter: adapter,
});

export default prisma;
