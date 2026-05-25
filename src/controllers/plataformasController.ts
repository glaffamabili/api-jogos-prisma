import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { AppError } from '../errors/AppError';

interface CreatePlataformaBody {
  nome?: string;
}

export async function createPlataforma(
  req: Request<unknown, unknown, CreatePlataformaBody>,
  res: Response,
) {
  const { nome } = req.body;

  if (!nome || typeof nome !== 'string' || !nome.trim()) {
    throw new AppError('O campo nome é obrigatório.', 400);
  }

  const plataforma = await prisma.plataforma.create({
    data: { nome: nome.trim() },
  });

  return res.status(201).json(plataforma);
}

export async function listPlataformas(_req: Request, res: Response) {
  const plataformas = await prisma.plataforma.findMany({
    orderBy: { nome: 'asc' },
  });

  return res.status(200).json(plataformas);
}
