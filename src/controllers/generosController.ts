import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { AppError } from '../errors/AppError';

interface CreateGeneroBody {
  nome?: string;
}

export async function createGenero(
  req: Request<unknown, unknown, CreateGeneroBody>,
  res: Response,
) {
  const { nome } = req.body;

  if (!nome || typeof nome !== 'string' || !nome.trim()) {
    throw new AppError('O campo nome é obrigatório.', 400);
  }

  const genero = await prisma.genero.create({
    data: { nome: nome.trim() },
  });

  return res.status(201).json(genero);
}

export async function listGeneros(_req: Request, res: Response) {
  const generos = await prisma.genero.findMany({
    orderBy: { nome: 'asc' },
  });

  return res.status(200).json(generos);
}
