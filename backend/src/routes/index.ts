import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";
import { roleTestRoutes } from "./role-test.routes";
import { accessRoutes } from "./access.routes";
import { salesCoverageRoutes } from "./salesCoverage.routes";
import { cadastroClienteRoutes } from "./cadastro-cliente.routes";
import { solicitacaoClienteRoutes } from "./solicitacaoCliente.routes";
import { autorizacaoSolicitacaoRoutes } from "./autorizacaoSolicitacao.routes";
import { operadorSolicitacaoRoutes } from "./operadorSolicitacao.routes";

const routes = Router();

routes.get("/health", (_req, res) => {
  return res.status(200).json({
    message: "API funcionando",
  });
});

routes.use(authRoutes);
routes.use(userRoutes);
routes.use(roleTestRoutes);
routes.use(accessRoutes);
routes.use(salesCoverageRoutes);
routes.use(cadastroClienteRoutes);
routes.use(solicitacaoClienteRoutes);
routes.use(autorizacaoSolicitacaoRoutes);
routes.use(operadorSolicitacaoRoutes);

export { routes };