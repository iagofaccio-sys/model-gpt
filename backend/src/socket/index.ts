import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { Role } from "@prisma/client";
import { verifyAccessToken } from "../utils/jwt";

type SocketUser = {
  userId: string;
  role: Role;
  email: string;
  name?: string;
};

let io: Server;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      console.log("Handshake auth:", socket.handshake.auth);

      if (!token) {
        return next(new Error("Token não enviado no socket."));
      }

      const decoded = verifyAccessToken(token);

      socket.data.user = {
        userId: decoded.sub,
        role: decoded.role,
        email: decoded.email,
        name: decoded.name,
      } satisfies SocketUser;

      return next();
    } catch (error) {
      return next(new Error("Token inválido no socket."));
    }
  });

  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    const user = socket.data.user as SocketUser | undefined;
    console.log("Usuário do socket:", user);

    if (!user) {
      console.log("Socket conectado sem usuário autenticado.");
      socket.disconnect();
      return;
    }

    socket.join(`user:${user.userId}`);
    socket.join(`role:${user.role}`);

    console.log(`Entrou na sala user:${user.userId}`);
    console.log(`Entrou na sala role:${user.role}`);

    socket.emit("socket_conectado", {
      message: "Conectado com sucesso.",
      user,
    });

    socket.on("mensagem_teste_supervisor", (payload) => {
      console.log("Mensagem teste recebida:", payload);
      console.log("Role do remetente:", user.role);
      console.log("Emitindo para sala:", "role:OPERADOR");

      if (user.role !== "SUPERVISOR") {
        console.log("Bloqueado: usuário não é SUPERVISOR");
        return;
      }

      io.to("role:OPERADOR").emit("mensagem_teste_operador", {
        ...payload,
        senderName: payload?.senderName ?? user.name ?? user.email ?? "Supervisor",
        senderRole: payload?.senderRole ?? user.role,
      });

      console.log("Evento mensagem_teste_operador emitido");
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io não inicializado.");
  }

  return io;
}