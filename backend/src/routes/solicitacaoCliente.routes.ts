import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { solicitacaoClienteController } from "../controllers/solicitacaoCliente.controller";
import {
  solicitarAtivacaoInativacaoSchema,
  solicitarNovoCadastroSchema,
  solicitarAlteracaoSensivelSchema,
  solicitarAlteracaoNormalSchema,
} from "../schemas/solicitacaoCliente.schema";

const solicitacaoClienteRoutes = Router();

solicitacaoClienteRoutes.post(
  "/solicitacoes-clientes/ativacao-inativacao",
  ensureAuthenticated,
  validate(solicitarAtivacaoInativacaoSchema),
  solicitacaoClienteController.solicitarAtivacaoInativacao
);

solicitacaoClienteRoutes.post(
  "/solicitacoes-clientes/novo-cadastro",
  ensureAuthenticated,
  validate(solicitarNovoCadastroSchema),
  solicitacaoClienteController.solicitarNovoCadastro
);

solicitacaoClienteRoutes.post(
  "/solicitacoes-clientes/alteracao-sensivel",
  ensureAuthenticated,
  validate(solicitarAlteracaoSensivelSchema),
  solicitacaoClienteController.solicitarAlteracaoSensivel
);

solicitacaoClienteRoutes.post(
  "/solicitacoes-clientes/alteracao-normal",
  ensureAuthenticated,
  validate(solicitarAlteracaoNormalSchema),
  solicitacaoClienteController.solicitarAlteracaoNormal
);

solicitacaoClienteRoutes.get(
  "/solicitacoes-clientes",
  ensureAuthenticated,
  solicitacaoClienteController.listarSolicitacoes
);

solicitacaoClienteRoutes.get(
  "/solicitacoes-clientes/:id",
  ensureAuthenticated,
  solicitacaoClienteController.buscarSolicitacaoPorId
);

export { solicitacaoClienteRoutes };