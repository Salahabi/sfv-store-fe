import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

const prismadb = globalThis.prisma || new PrismaClient()
//This to avoid reccurent database multiple initiation 
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb

export default prismadb;