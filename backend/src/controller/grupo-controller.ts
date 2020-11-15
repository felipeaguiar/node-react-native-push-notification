import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Joi, celebrate } from 'celebrate';
import { Grupo } from '../model/grupo';
import auth from '../middleware/auth';
import { ConcurrencyError } from '../infrastructure/concurrency';
import { setPageable } from '../util/util';

const grupoController = Router();
grupoController.use(auth);

export const identity = {
  params: Joi.object({
    id: Joi.number().min(1).required()
  })
};

const schema = {
  body: Joi.object({
    id: Joi.number(),
    nome: Joi.string().required(),
    version: Joi.number()
  })
};

const filter = {
  query: Joi.object({
    size: Joi.number().min(1),
    page: Joi.number().min(0),
    sort: Joi.string(),
    order: Joi.string(),
    nome: Joi.string(),
    uf: Joi.string().max(2).min(2)
  })
};

grupoController.get('/', celebrate(filter), asyncHandler(async (request: Request, response: Response) => {
  let query = await Grupo.createQueryBuilder('g')
    .leftJoinAndSelect('g.usuarios', 'u');

  query = addWhere(query, request.query);
  query = setPageable(query, request.query);
  query = setOrder(query, request.query);

  const [usuarios, count] = await query.getManyAndCount();

  response.header('X-Count', String(count)).send(usuarios);
}));

grupoController.get('/:id', celebrate(identity), asyncHandler(async (request: Request, response: Response) => {
  const grupo = await Grupo.findOneOrFail(request.params.id);
  response.send(grupo);
}));

grupoController.post('/', celebrate(schema), asyncHandler(async (request: Request, response: Response) => {
  const grupo = Grupo.create(request.body as Grupo);
  await grupo.save();

  const grupoSalvo = await Grupo.findOne(grupo.id);
  response.status(201).send(grupoSalvo);
}));

grupoController.put('/:id', celebrate({ ...identity, ...schema }), asyncHandler(async (request: Request, response: Response) => {
  const grupo = await Grupo.findOneOrFail(request.params.id);

  if (grupo.version !== request.body.version) {
    throw new ConcurrencyError(grupo);
  }

  grupo.nome = request.body.nome;

  await grupo.save();

  const grupoSalvo = await Grupo.findOne(grupo.id);
  response.status(200).send(grupoSalvo);
}));

grupoController.delete('/:id', celebrate(identity), asyncHandler(async (request: Request, response: Response) => {
  const grupo = await Grupo.findOneOrFail(request.params.id);
  await grupo.remove();
  response.status(204).send();
}));

function addWhere(query, params) {
  if (params.nome) {
    query = query.andWhere('UPPER(g.nome) LIKE :nome', { nome: `%${params.nome.toUpperCase()}%` });
  }

  return query;
}

function setOrder(query, params) {
  if (params.sort === 'nome') {
    query = query.orderBy('g.nome', params.order.toUpperCase());
  } else {
    query = query.orderBy('g.id', 'ASC');
  }

  return query;
}

export default grupoController;
