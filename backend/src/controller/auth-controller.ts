import { Router, Request, Response } from 'express';
import createError from 'http-errors';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { celebrate, Joi } from 'celebrate';
import moment from 'moment';
import Mustache from 'mustache';
import { Usuario } from '../model/usuario';
import mailer from '../service/mailer';
import auth from '../middleware/auth';
import { Papel } from '../model/pepel';
import { getHtmlTemplate } from '../util/util';

const authController = Router();

const options = {
  abortEarly: false
};

const register = {
  body: Joi.object().keys({
    nome: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).required()
  })
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).required()
  })
};

function sign(usuario: Usuario) {

  if (!process.env.AUTH_SECRET) {
    throw new Error('Secret não configurado');
  }

  return jwt.sign({
    id: usuario.id,
    nome: usuario.nome,
    papel: usuario.papel
  }, process.env.AUTH_SECRET, { expiresIn: '3d' });
}

authController.post('/register', celebrate(register, options), asyncHandler(async (request: Request, response: Response) => {
  const { email, senha } = request.body;

  if (await Usuario.findOne({ email })) {
    throw createError(400, 'Usuário já existe');
  }

  const usuario = Usuario.create(request.body as Usuario);
  usuario.papel = Papel.usuario;
  usuario.senha = await bcrypt.hash(senha, 10);
  await usuario.save();

  delete usuario.senha;
  delete usuario.resetToken;
  delete usuario.validade;
  delete usuario.updatedAt;
  delete usuario.createdAt;

  return response.send({
    usuario,
    token: sign(usuario)
  });
}));

authController.post('/login', celebrate(login, options), asyncHandler(async (request: Request, response: Response) => {
  const { email, senha } = request.body;

  const usuario = await Usuario.createQueryBuilder('u')
    .addSelect('u.senha')
    .where('u.email = :email', { email })
    .getOne();

  if (!usuario || !usuario.senha || !(await bcrypt.compare(senha, usuario.senha))) {
    throw createError(400, 'Usuário ou senha inválidos');
  }

  delete usuario.senha;

  response.send({
    usuario,
    token: sign(usuario)
  });
}));

authController.post('/forgot-password', asyncHandler(async (request: Request, response: Response) => {
  const { email } = request.body;

  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    throw createError(400, 'Usuário não encontrado');
  }

  const token = crypto.randomBytes(48).toString('hex');
  const expires = moment().add(15, 'm').toDate();

  usuario.resetToken = token;
  usuario.validade = expires;
  await usuario.save();

  const template = await getHtmlTemplate('email-template');
  const body = Mustache.render(template, { token, host: request.get('host') });

  try {
    await mailer.sendMail({
      to: email,
      from: process.env.MAIL_FROM,
      subject: 'Redefinir Senha.',
      html: body
    });

    response.status(200).send();
  } catch (error) {
    response.status(400).send();
  }
}));

authController.post('/reset-password', asyncHandler(async (request: Request, response: Response) => {
  const { token, senha } = request.body;

  const usuario = await Usuario.createQueryBuilder('u')
    .addSelect('u.resetToken')
    .addSelect('u.validade')
    .where('u.resetToken = :resetToken', { resetToken: token })
    .getOne();

  if (!usuario || token !== usuario.resetToken) {
    throw createError(400, 'Token inválido.');
  }

  const now = new Date();
  if (!usuario.validade || now > usuario.validade) {
    throw createError(400, 'Token expirado.');
  }

  usuario.senha = await bcrypt.hash(senha, 10);
  usuario.resetToken = null;
  usuario.validade = null;
  await usuario.save();

  response.status(200).send();
}));

authController.get('/new-password/:token', asyncHandler(async (request: Request, response: Response) => {
  const token = request.params.token;

  response.render('new-password', { token });
}));

authController.post('/change-password/', auth, asyncHandler(async (request: Request, response: Response) => {
  const { email, senha, novaSenha } = request.body;

  const usuario = await Usuario.createQueryBuilder('u')
    .addSelect('u.senha')
    .where('u.email = :email', { email })
    .getOne();

  if (!usuario || !usuario.senha || !(await bcrypt.compare(senha, usuario.senha))) {
    throw createError(400, 'Usuário ou senha inválidos');
  }

  usuario.senha = await bcrypt.hash(novaSenha, 10);
  await usuario.save();

  response.status(200).send();
}));

export default authController;
