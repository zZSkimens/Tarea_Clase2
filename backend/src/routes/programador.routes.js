"use strict";
import { Router } from "express";
import { isJefe } from "../middlewares/authorization2.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
deleteProgramador,
getProgramador,
getProgramadores,
updateProgramador,
} from "../controllers/programador.controller.js";

const router = Router();

router
.use(authenticateJwt)
.use(isJefe);

router
.get("/", getProgramadores)
.get("/detail/", getProgramador)
.patch("/detail/", updateProgramador)
.delete("/detail/", deleteProgramador);

export default router;