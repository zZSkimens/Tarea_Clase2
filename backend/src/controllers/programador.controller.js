"use strict";
import {
  deleteProgramadorService,
  getProgramadorService,
  getProgramadoresService,
  updateProgramadorService,
} from "../services/programador.service.js";
import {
  programadorBodyValidation,
  programadorQueryValidation,
} from "../validations/programador.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getProgramador(req, res) {
  try {
    const { rut, id, email } = req.query;

    const { error } = programadorQueryValidation.validate({ rut, id, email });

    if (error) return handleErrorClient(res, 400, error.message);

    const [programador, errorProgramador] = await getProgramadorService({ rut, id, email });

    if (errorProgramador) return handleErrorClient(res, 404, errorProgramador);

    handleSuccess(res, 200, "Programador encontrado", programador);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getProgramadores(req, res) {
  try {
    const [programadores, errorProgramadores] = await getProgramadoresService();

    if (errorProgramadores) return handleErrorClient(res, 404, errorProgramadores);

    programadores.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Programadores encontrados", programadores);
  } catch (error) {
    handleErrorServer(
      res,
      500,
      error.message,
    );
  }
}

export async function updateProgramador(req, res) {
  try {
    const { rut, id, email } = req.query;
    const { body } = req;

    const { error: queryError } = programadorQueryValidation.validate({
      rut,
      id,
      email,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const { error: bodyError } = programadorBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [programador, programadorError] = await updateProgramadorService({ rut, id, email }, body);

    if (programadorError) return handleErrorClient(res, 400, "Error modificando al programador", programadorError);

    handleSuccess(res, 200, "Programador modificado correctamente", programador);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteProgramador(req, res) {
  try {
    const { rut, id, email } = req.query;

    const { error: queryError } = programadorQueryValidation.validate({
      rut,
      id,
      email,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const [programadorDelete, errorProgramadorDelete] = await deleteProgramadorService({
      rut,
      id,
      email,
    });

    if (errorProgramadorDelete) return handleErrorClient(res, 404, "Error eliminado al programador", errorProgramadorDelete);

    handleSuccess(res, 200, "Programador eliminado correctamente", programadorDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}