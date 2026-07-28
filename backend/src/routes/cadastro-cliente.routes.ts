import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware";
import { cadastroClienteController } from "../controllers/cadastro-cliente.controller";

const cadastroClienteRoutes = Router();

cadastroClienteRoutes.get(
  "/subcanais",
  ensureAuthenticated,
  cadastroClienteController.listarSubcanais
);

cadastroClienteRoutes.get(
  "/rotas",
  ensureAuthenticated,
  cadastroClienteController.listarRotas
);

cadastroClienteRoutes.get(
  "/dias-atendimento",
  ensureAuthenticated,
  cadastroClienteController.listarDiasAtendimento
);

cadastroClienteRoutes.get(
  "/clientes",
  ensureAuthenticated,
  cadastroClienteController.listarClientes
);

cadastroClienteRoutes.get(
  "/clientes/:id",
  ensureAuthenticated,
  cadastroClienteController.buscarClientePorId
);

export { cadastroClienteRoutes };