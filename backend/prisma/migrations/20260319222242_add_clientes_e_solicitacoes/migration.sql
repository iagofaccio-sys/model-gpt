-- CreateEnum
CREATE TYPE "TipoSolicitacaoCliente" AS ENUM ('ATIVACAO_INATIVACAO', 'NOVO_CADASTRO', 'ALTERACAO_SENSIVEL', 'ALTERACAO_NORMAL');

-- CreateEnum
CREATE TYPE "StatusSolicitacaoCliente" AS ENUM ('PENDENTE', 'EM_ANALISE', 'CONCLUIDO', 'REJEITADO');

-- CreateEnum
CREATE TYPE "AcaoAtivacaoCliente" AS ENUM ('ATIVAR', 'INATIVAR');

-- CreateTable
CREATE TABLE "subcanais" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subcanais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rotas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rotas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dias_atendimento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dias_atendimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "codigoCliente" TEXT,
    "cnpj" TEXT NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "nomeFantasia" TEXT NOT NULL,
    "subcanalId" TEXT NOT NULL,
    "rotaId" TEXT NOT NULL,
    "sequencia" INTEGER NOT NULL,
    "diaAtendimentoId" TEXT NOT NULL,
    "horarioFuncionamento" TEXT NOT NULL,
    "nomeContato" TEXT NOT NULL,
    "telefoneWhatsapp" TEXT NOT NULL,
    "limiteCredito" DECIMAL(12,2) NOT NULL,
    "diasPrazo" INTEGER NOT NULL,
    "bloqueioFinanceiro" BOOLEAN NOT NULL DEFAULT false,
    "fotoInternaUrl" TEXT,
    "fotoExternaUrl" TEXT,
    "vendedorId" TEXT NOT NULL,
    "baseId" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitacoes_clientes" (
    "id" TEXT NOT NULL,
    "tipoSolicitacao" "TipoSolicitacaoCliente" NOT NULL,
    "status" "StatusSolicitacaoCliente" NOT NULL DEFAULT 'PENDENTE',
    "clienteId" TEXT,
    "solicitadoPorId" TEXT NOT NULL,
    "solicitadoPorPerfil" "Role" NOT NULL,
    "operadorResponsavelId" TEXT,
    "autorizadoPorGerenteId" TEXT,
    "autorizacaoGerente" BOOLEAN NOT NULL DEFAULT false,
    "acaoAtivacao" "AcaoAtivacaoCliente",
    "motivo" TEXT,
    "observacaoSolicitacao" TEXT,
    "observacaoOperador" TEXT,
    "dadosSolicitados" JSONB NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "concluidoEm" TIMESTAMP(3),

    CONSTRAINT "solicitacoes_clientes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subcanais_nome_key" ON "subcanais"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "rotas_nome_key" ON "rotas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "dias_atendimento_nome_key" ON "dias_atendimento"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_codigoCliente_key" ON "clientes"("codigoCliente");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cnpj_key" ON "clientes"("cnpj");

-- CreateIndex
CREATE INDEX "clientes_vendedorId_idx" ON "clientes"("vendedorId");

-- CreateIndex
CREATE INDEX "clientes_baseId_idx" ON "clientes"("baseId");

-- CreateIndex
CREATE INDEX "clientes_subcanalId_idx" ON "clientes"("subcanalId");

-- CreateIndex
CREATE INDEX "clientes_rotaId_idx" ON "clientes"("rotaId");

-- CreateIndex
CREATE INDEX "clientes_diaAtendimentoId_idx" ON "clientes"("diaAtendimentoId");

-- CreateIndex
CREATE INDEX "solicitacoes_clientes_clienteId_idx" ON "solicitacoes_clientes"("clienteId");

-- CreateIndex
CREATE INDEX "solicitacoes_clientes_solicitadoPorId_idx" ON "solicitacoes_clientes"("solicitadoPorId");

-- CreateIndex
CREATE INDEX "solicitacoes_clientes_operadorResponsavelId_idx" ON "solicitacoes_clientes"("operadorResponsavelId");

-- CreateIndex
CREATE INDEX "solicitacoes_clientes_autorizadoPorGerenteId_idx" ON "solicitacoes_clientes"("autorizadoPorGerenteId");

-- CreateIndex
CREATE INDEX "solicitacoes_clientes_status_idx" ON "solicitacoes_clientes"("status");

-- CreateIndex
CREATE INDEX "solicitacoes_clientes_tipoSolicitacao_idx" ON "solicitacoes_clientes"("tipoSolicitacao");

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_subcanalId_fkey" FOREIGN KEY ("subcanalId") REFERENCES "subcanais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_rotaId_fkey" FOREIGN KEY ("rotaId") REFERENCES "rotas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_diaAtendimentoId_fkey" FOREIGN KEY ("diaAtendimentoId") REFERENCES "dias_atendimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes_clientes" ADD CONSTRAINT "solicitacoes_clientes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes_clientes" ADD CONSTRAINT "solicitacoes_clientes_solicitadoPorId_fkey" FOREIGN KEY ("solicitadoPorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes_clientes" ADD CONSTRAINT "solicitacoes_clientes_operadorResponsavelId_fkey" FOREIGN KEY ("operadorResponsavelId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes_clientes" ADD CONSTRAINT "solicitacoes_clientes_autorizadoPorGerenteId_fkey" FOREIGN KEY ("autorizadoPorGerenteId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
