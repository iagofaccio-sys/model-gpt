import { Router } from "express";
import { Role } from "@prisma/client";
import { ensureAuthenticated } from "../middlewares/auth.middleware";
import { ensureRole } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { operadorSolicitacaoController } from "../controllers/operadorSolicitacao.controller";
import {
  concluirSolicitacaoSchema,
  rejeitarSolicitacaoOperadorSchema,
  editarDadosSolicitacaoSchema,
  liberarAtualizacaoSchema,
} from "../schemas/operadorSolicitacao.schema";

const operadorSolicitacaoRoutes = Router();

operadorSolicitacaoRoutes.get(
  "/operador/solicitacoes-clientes/pendentes",
  ensureAuthenticated,
  ensureRole(Role.OPERADOR),
  operadorSolicitacaoController.listarPendentes
);

operadorSolicitacaoRoutes.get(
  "/operador/solicitacoes-clientes/:id",
  ensureAuthenticated,
  ensureRole(Role.OPERADOR),
  operadorSolicitacaoController.buscarPorId
);

operadorSolicitacaoRoutes.patch(
  "/operador/solicitacoes-clientes/:id/assumir",
  ensureAuthenticated,
  ensureRole(Role.OPERADOR),
  operadorSolicitacaoController.assumirAnalise
);

operadorSolicitacaoRoutes.patch(
  "/operador/solicitacoes-clientes/:id/editar-dados",
  ensureAuthenticated,
  ensureRole(Role.OPERADOR),
  validate(editarDadosSolicitacaoSchema),
  operadorSolicitacaoController.editarDados
);

operadorSolicitacaoRoutes.patch(
  "/operador/solicitacoes-clientes/:id/concluir",
  ensureAuthenticated,
  ensureRole(Role.OPERADOR),
  validate(concluirSolicitacaoSchema),
  operadorSolicitacaoController.concluir
);

operadorSolicitacaoRoutes.patch(
  "/operador/solicitacoes-clientes/:id/rejeitar",
  ensureAuthenticated,
  ensureRole(Role.OPERADOR),
  validate(rejeitarSolicitacaoOperadorSchema),
  operadorSolicitacaoController.rejeitar
);

operadorSolicitacaoRoutes.patch(
  "/operador/solicitacoes-clientes/:id/liberar-atualizacao",
  ensureAuthenticated,
  ensureRole(Role.OPERADOR),
  validate(liberarAtualizacaoSchema),
  operadorSolicitacaoController.liberarAtualizacao
);

export { operadorSolicitacaoRoutes };