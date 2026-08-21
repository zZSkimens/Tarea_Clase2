import Programador from "../entity/programador.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
handleErrorClient,
handleErrorServer,
} from "../handlers/responseHandlers.js";

export async function isJefe(req, res, next) {
try {
    const programadorRepository = AppDataSource.getRepository(Programador);

    const programadorFound = await programadorRepository.findOneBy({ email: req.user.email });

    if (!programadorFound) {
    return handleErrorClient(
        res,
        404,
        "Programador no encontrado en la base de datos",
    );
    }

    const rolProgramador = programadorFound.rol;

    if (rolProgramador !== "jefe") {
        return handleErrorClient(
            res,
            403,
            "Error al acceder al recurso",
            "Se requiere un rol de jefe para realizar esta acción."
        );
    }
    next();
} catch (error) {
    handleErrorServer(
    res,
    500,
    error.message,
    );
}
}