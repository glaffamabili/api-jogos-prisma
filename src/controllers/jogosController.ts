import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { AppError } from '../errors/AppError';

interface CreateJogoBody {
  titulo?: string;
  idGenero?: number;
  plataformaIds?: number[];
}

interface AddPlataformasBody {
  plataformaIds?: number[];
}

export async function createJogo(
  req: Request<unknown, unknown, CreateJogoBody>,
  res: Response,
) {
  const { titulo, idGenero, plataformaIds } = req.body;

  if (!titulo || typeof titulo !== 'string' || !titulo.trim()) {
    throw new AppError('O campo titulo é obrigatório.', 400);
  }

  if (typeof idGenero !== 'number' || Number.isNaN(idGenero)) {
    throw new AppError('O campo idGenero é obrigatório e deve ser um número.', 400);
  }

  const genero = await prisma.genero.findUnique({
    where: { id: idGenero },
  });

  if (!genero) {
    throw new AppError('Gênero não encontrado para o idGenero informado.', 404);
  }

  const uniquePlataformaIds = Array.isArray(plataformaIds)
    ? Array.from(new Set(plataformaIds.filter((id) => typeof id === 'number' && !Number.isNaN(id))))
    : [];

  if (Array.isArray(plataformaIds) && plataformaIds.length !== uniquePlataformaIds.length) {
    throw new AppError('Os ids de plataforma devem ser números inteiros e únicos.', 400);
  }

  const connectPlatforms =
    uniquePlataformaIds.length > 0
      ? uniquePlataformaIds.map((id) => ({ id }))
      : undefined;

  if (connectPlatforms) {
    const plataformas = await prisma.plataforma.findMany({
      where: { id: { in: uniquePlataformaIds } },
    });

    if (plataformas.length !== uniquePlataformaIds.length) {
      throw new AppError('Uma ou mais plataformas informadas não existem.', 400);
    }
  }

  const jogo = await prisma.jogo.create({
    data: {
      titulo: titulo.trim(),
      genero: { connect: { id: idGenero } },
      plataformas: connectPlatforms ? { connect: connectPlatforms } : undefined,
    },
    include: { genero: true, plataformas: true },
  });

  return res.status(201).json(jogo);
}

export async function listJogos(_req: Request, res: Response) {
  const jogos = await prisma.jogo.findMany({
    include: {
      genero: true,
      plataformas: true,
    },
    orderBy: { titulo: 'asc' },
  });

  return res.status(200).json(jogos);
}

export async function addPlataformasToJogo(
  req: Request<{ id: string }, unknown, AddPlataformasBody>,
  res: Response,
) {
  const jogoId = Number(req.params.id);
  const { plataformaIds } = req.body;

  if (Number.isNaN(jogoId)) {
    throw new AppError('Parâmetro id inválido.', 400);
  }

  if (!Array.isArray(plataformaIds) || plataformaIds.length === 0) {
    throw new AppError('O campo plataformaIds deve ser um array não vazio.', 400);
  }

  const jogo = await prisma.jogo.findUnique({
    where: { id: jogoId },
  });

  if (!jogo) {
    throw new AppError('Jogo não encontrado.', 404);
  }

  const uniquePlataformaIds = Array.from(
    new Set(plataformaIds.filter((id) => typeof id === 'number' && !Number.isNaN(id))),
  );

  if (uniquePlataformaIds.length !== plataformaIds.length) {
    throw new AppError('Os ids de plataforma devem ser números inteiros e únicos.', 400);
  }

  const plataformas = await prisma.plataforma.findMany({
    where: { id: { in: uniquePlataformaIds } },
  });

  if (plataformas.length !== uniquePlataformaIds.length) {
    throw new AppError('Uma ou mais plataformas informadas não existem.', 400);
  }

  const updatedJogo = await prisma.jogo.update({
    where: { id: jogoId },
    data: {
      plataformas: {
        connect: uniquePlataformaIds.map((id) => ({ id })),
      },
    },
    include: {
      genero: true,
      plataformas: true,
    },
  });

  return res.status(200).json(updatedJogo);
}
