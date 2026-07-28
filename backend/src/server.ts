import http from "http";
import { app } from "./app";
import { env } from "./config/env";
import { initSocket } from "./socket";

const server = http.createServer(app);

initSocket(server);

server.listen(env.port, "0.0.0.0", () => {
  console.log(`Servidor rodando em http://0.0.0.0:${env.port}`);
});