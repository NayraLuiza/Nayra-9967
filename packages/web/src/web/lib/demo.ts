export const carriers = ["TRD", "DeY", "Tragetta", "Pacífico"];
export const areas = [
  { id: "visao-geral", name: "Visão Geral" },
  { id: "analise", name: "Análise" },
  { id: "armazenagem", name: "Gestão de Armazenagem" },
  { id: "importar", name: "Importar Arquivos" },
];
export const slugs = ["trd", "dey", "tragetta", "pacifico"];
export const clients = ["Ambev", "Nestlé", "Unilever", "BRF", "P&G", "JBS", "Bunge", "Danone"];
export type RecordRow = {
  id: string;
  cte: string;
  carrier: string;
  client: string;
  city: string;
  state: string;
  region: string;
  forecast: string;
  schedule: string;
  limit: string;
  used: number;
  balance: number;
  days: number;
  cost: number;
  freight: number;
  status: string;
  alert: string;
  month: string;
};
const places = [
  ["São Paulo", "SP", "Sudeste"],
  ["Campinas", "SP", "Sudeste"],
  ["Curitiba", "PR", "Sul"],
  ["Rio de Janeiro", "RJ", "Sudeste"],
  ["Belo Horizonte", "MG", "Sudeste"],
  ["Salvador", "BA", "Nordeste"],
  ["Goiânia", "GO", "Centro-Oeste"],
  ["Manaus", "AM", "Norte"],
];
export const records: RecordRow[] = carriers.flatMap((carrier, c) =>
  Array.from({ length: 320 }, (_, i) => {
    const [city, state, region] = places[(i * 3 + c) % 8]!;
    const status = [
      "Entregue",
      "Entregue",
      "Entregue",
      "Pendente",
      "Agendado",
      "Entregue",
      "Atrasado",
      "Agendado",
      "Pendente",
      "Entregue",
    ][(i + c) % 10]!;
    const used = (i * 7 + c) % 16;
    const days = Math.max(0, used - 10);
    const day = 1 + (i % 5);
    return {
      id: String(840100 + c * 1000 + i),
      cte: String(12001 + c * 1000 + i),
      carrier,
      client: clients[(i * 5 + c) % 8]!,
      city: city!,
      state: state!,
      region: region!,
      forecast: `0${day}/10/2026`,
      schedule: status === "Pendente" ? "—" : `0${Math.min(5, day + 1)}/10/2026`,
      limit: `${10 + day}/10/2026`,
      used,
      balance: 10 - used,
      days,
      cost: days * (145 + (i % 4) * 30),
      freight: 1240 + (i % 13) * 185,
      status,
      alert: days
        ? "FreeTime excedido"
        : used >= 8
          ? "FreeTime próximo do vencimento"
          : status === "Pendente"
            ? "Sem agendamento"
            : status === "Atrasado"
              ? "Agendamento após a previsão"
              : "Sem alertas",
      month: i % 5 === 0 ? "09" : "10",
    };
  }),
);
export const money = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
export function group(rows: RecordRow[], key: keyof RecordRow, mode: "count" | "cost" = "count") {
  const map: Record<string, number> = {};
  rows.forEach(
    (r) => (map[String(r[key])] = (map[String(r[key])] || 0) + (mode === "cost" ? r.cost : 1)),
  );
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}
