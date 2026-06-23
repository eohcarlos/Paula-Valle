# 💇‍♀️ Salão Paula Valle — Sistema de Agendamento Premium

Sistema web completo, moderno e responsivo para o **Salão Paula Valle** ([@paulavalle_e](https://instagram.com/paulavalle_e)), com painéis separados para **Clientes** e **Administração**.

Paleta da marca: **branco, bege, rosa claro e dourado** ✨

---

## 🚀 Como rodar

```bash
cd salao-paula-valle
npm install
npm run dev
```

Acesse **http://localhost:5173**

### Contas de demonstração

| Perfil   | E-mail                  | Senha     |
|----------|-------------------------|-----------|
| 👩‍💼 Admin   | `admin@paulavalle.com`  | `admin123` |
| 👩 Cliente | `cliente@teste.com`     | `123456`   |

> Os dados são salvos no **localStorage** do navegador. Em "Configurações → Restaurar demo" você recarrega os dados de exemplo.

---

## 🧱 Stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS** (tema premium com animações)
- **React Router** (rotas protegidas por papel)
- **Recharts** (gráficos interativos)
- **jsPDF + SheetJS (xlsx)** (exportação de relatórios)
- **date-fns** (datas em pt-BR)
- **lucide-react** (ícones)

Persistência via `localStorage` (camada de dados em `src/store/store.tsx`), pronta para ser trocada por uma API real.

---

## 👩 Painel do Cliente (`/app`)

- **Cadastro / Login / Recuperação de senha**
- **Dashboard**: próximo agendamento, últimos atendimentos, total de atendimentos, valor gasto e serviços favoritos
- **Agendamento online**: múltiplos serviços, data, horário (horários ocupados ficam indisponíveis), observações
- **Meus agendamentos**: filtros por status, reagendar, cancelar, ver detalhes
- **Histórico** com avaliação por estrelas (1–5) e comentários
- **Fidelidade**: pontos, níveis e recompensas
- **Favoritos** de serviços
- **Perfil**: nome, telefone, e-mail, foto e senha
- **WhatsApp** com mensagem automática

## 👩‍💼 Painel Administrativo (`/admin`)

- **Dashboard**: agendamentos do dia/semana, clientes, atendimentos, faturamento diário/mensal e **gráficos interativos**
- **Gestão de agendamentos**: criar, editar, reagendar, confirmar, iniciar, finalizar, cancelar
- **Agenda inteligente**: visualização **diária** e **semanal** com horários livres/ocupados
- **Gestão de clientes**: cadastro, busca (nome/telefone/serviço) e histórico completo
- **Gestão de serviços**: nome, descrição, duração, preço, ativo/inativo
- **Relatórios** por dia/semana/mês com exportação **PDF** e **Excel**
- **Configurações**: nome, Instagram, WhatsApp, endereço, logo, horário e dias de funcionamento, tempo entre atendimentos

## 🔔 Notificações

Geradas automaticamente para cliente (confirmação, alteração, cancelamento) e administração (novos agendamentos).

---

## 📁 Estrutura

```
src/
├── components/      # UI reutilizável (Button, Card, Modal, etc.)
├── data/            # dados de exemplo (seed)
├── lib/             # utilidades (datas, disponibilidade, export, whatsapp)
├── pages/
│   ├── client/      # painel do cliente
│   └── admin/       # painel administrativo
├── store/           # estado global + persistência
└── types.ts         # modelos de domínio
```

---

> 💡 Para produção, substitua a camada `store` por chamadas a uma API e use hash de senha no backend.
