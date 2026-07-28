import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware";
import { ensureRole } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { autorizacaoSolicitacaoController } from "../controllers/autorizacaoSolicitacao.controller";
import { rejeitarSolicitacaoSchema } from "../schemas/autorizacaoSolicitacao.schema";
import { Role } from "@prisma/client";

const autorizacaoSolicitacaoRoutes = Router();

autorizacaoSolicitacaoRoutes.get(
  "/solicitacoes-clientes/autorizacoes/pendentes",
  ensureAuthenticated,
  ensureRole(Role.GERENTE),
  autorizacaoSolicitacaoController.listarPendentes
);

autorizacaoSolicitacaoRoutes.patch(
  "/solicitacoes-clientes/:id/autorizar-gerente",
  ensureAuthenticated,
  ensureRole(Role.GERENTE),
  autorizacaoSolicitacaoController.autorizar
);

autorizacaoSolicitacaoRoutes.patch(
  "/solicitacoes-clientes/:id/rejeitar-gerente",
  ensureAuthenticated,
  ensureRole(Role.GERENTE),
  validate(rejeitarSolicitacaoSchema),
  autorizacaoSolicitacaoController.rejeitar
);

export { autorizacaoSolicitacaoRoutes };