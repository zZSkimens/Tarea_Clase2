"use strict";
import Programador from "../entity/programador.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";

export async function getProgramadorService(query) {
try {
    const { rut, id, email } = query;

    const programadorRepository = AppDataSource.getRepository(Programador);

    const programadorFound = await programadorRepository.findOne({
    where: [{ id: id }, { rut: rut }, { email: email }],
    });

    if (!programadorFound) return [null, "Programador no encontrado"];

    const { password, ...programadorData } = programadorFound;

    return [programadorData, null];
} catch (error) {
    console.error("Error obtener el programador:", error);
    return [null, "Error interno del servidor"];
}
}

export async function getProgramadoresService() {
try {
    const programadorRepository = AppDataSource.getRepository(Programador);

    const programadores = await programadorRepository.find();

    if (!programadores || programadores.length === 0) return [null, "No hay programadores"];

    const programadoresData = programadores.map(({ password, ...programador }) => programador);

    return [programadoresData, null];
} catch (error) {
    console.error("Error al obtener a los programadores:", error);
    return [null, "Error interno del servidor"];
}
}

export async function updateProgramadorService(query, body) {
try {
    const { id, rut, email } = query;

    const programadorRepository = AppDataSource.getRepository(Programador);

    const programadorFound = await programadorRepository.findOne({
    where: [{ id: id }, { rut: rut }, { email: email }],
    });

    if (!programadorFound) return [null, "Programador no encontrado"];

    const existingProgramador = await programadorRepository.findOne({
    where: [{ rut: body.rut }, { email: body.email }],
    });

    if (existingProgramador && existingProgramador.id !== programadorFound.id) {
    return [null, "Ya existe un programador con el mismo rut o email"];
    }

    if (body.password) {
    const matchPassword = await comparePassword(
        body.password,
        programadorFound.password,
    );

    if (!matchPassword) return [null, "La contraseña no coincide"];
    }

    const dataProgramadorUpdate = {
    nombreCompleto: body.nombreCompleto,
    rut: body.rut,
    email: body.email,
    rol: body.rol,
    updatedAt: new Date(),
    };

    if (body.newPassword && body.newPassword.trim() !== "") {
    dataProgramadorUpdate.password = await encryptPassword(body.newPassword);
    }

    await programadorRepository.update({ id: programadorFound.id }, dataProgramadorUpdate);

    const programadorData = await programadorRepository.findOne({
    where: { id: programadorFound.id },
    });

    if (!programadorData) {
    return [null, "Programador no encontrado después de actualizar"];
    }

    const { password, ...programadorUpdated } = programadorData;

    return [programadorUpdated, null];
} catch (error) {
    console.error("Error al modificar un programador:", error);
    return [null, "Error interno del servidor"];
}
}

export async function deleteProgramadorService(query) {
try {
    const { id, rut, email } = query;

    const programadorRepository = AppDataSource.getRepository(Programador);

    const programadorFound = await programadorRepository.findOne({
    where: [{ id: id }, { rut: rut }, { email: email }],
    });

    if (!programadorFound) return [null, "Programador no encontrado"];

    if (programadorFound.rol === "jefe") {
    return [null, "No se puede eliminar un programador con rol de jefe"];
    }

    const programadorDeleted = await programadorRepository.remove(programadorFound);

    const { password, ...dataProgramador } = programadorDeleted;

    return [dataProgramador, null];
} catch (error) {
    console.error("Error al eliminar un programador:", error);
    return [null, "Error interno del servidor"];
}
}