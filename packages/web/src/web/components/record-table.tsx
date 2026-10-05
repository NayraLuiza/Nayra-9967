import { useState, useEffect } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { money, type RecordRow } from "../lib/demo";
export function Badge({ status }: { status: string }) {
  return (
    <span
      className={`badge ${status === "Atrasado" || status === "FreeTime excedido" ? "critical" : status === "Pendente" || status.includes("próximo") ? "warning" : status === "Agendado" ? "scheduled" : "success"}`}
    >
      <span className="status-dot" />
      {status}
    </span>
  );
}
export function RecordTable({
  rows,
  storage = false,
  onDetail,
}: {
  rows: RecordRow[];
  storage?: boolean;
  onDetail: (r: RecordRow) => void;
}) {
  const [page, setPage] = useState(0);
  const [desc, setDesc] = useState(false);
  useEffect(() => setPage(0), [rows]);
  const sorted = [...rows].sort((a, b) =>
    desc ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id),
  );
  const size = 6;
  const pages = Math.max(1, Math.ceil(rows.length / size));
  return (
    <>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>
                <button className="sort" onClick={() => setDesc(!desc)}>
                  Nota Fiscal <ArrowUpDown size={12} />
                </button>
              </th>
              <th>Cliente</th>
              {storage ? (
                <>
                  <th>Cidade / UF</th>
                  <th>Previsão</th>
                  <th>Agendamento</th>
                  <th>Limite FreeTime</th>
                  <th>Dias utilizados</th>
                  <th>Saldo FreeTime</th>
                  <th>Dias armazenados</th>
                  <th>Valor total</th>
                  <th>Status</th>
                  <th>Alertas</th>
                </>
              ) : (
                <>
                  <th>Transportadora</th>
                  <th>Destino</th>
                  <th>Previsão</th>
                  <th>Valor de frete</th>
                  <th>Status</th>
                </>
              )}
              <th>
                <span className="sr-only">Detalhes</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.slice(page * size, page * size + size).map((r) => (
              <tr key={r.id}>
                <td className="strong">
                  {r.id}
                  <small>CTe {r.cte}</small>
                </td>
                <td>{r.client}</td>
                {storage ? (
                  <>
                    <td>
                      {r.city} / {r.state}
                    </td>
                    <td>{r.forecast}</td>
                    <td>{r.schedule}</td>
                    <td>{r.limit}</td>
                    <td>{r.used} dias</td>
                    <td className={r.balance < 0 ? "red-text" : ""}>{r.balance} dias</td>
                    <td>{r.days} dias</td>
                    <td className="strong">{money(r.cost)}</td>
                    <td>
                      <Badge status={r.status} />
                    </td>
                    <td>{r.alert}</td>
                  </>
                ) : (
                  <>
                    <td>{r.carrier}</td>
                    <td>
                      {r.city}
                      <small>{r.state}</small>
                    </td>
                    <td>{r.forecast}</td>
                    <td className="strong">{money(r.freight)}</td>
                    <td>
                      <Badge status={r.status} />
                    </td>
                  </>
                )}
                <td>
                  <button
                    className="icon-button"
                    aria-label={`Ver detalhes da nota ${r.id}`}
                    onClick={() => onDetail(r)}
                  >
                    <ArrowUpRight size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <div className="empty">Nenhum registro encontrado. Tente ajustar os filtros.</div>
        )}
      </div>
      <div className="pagination">
        <span>
          {rows.length
            ? `${page * size + 1}–${Math.min((page + 1) * size, rows.length)} de ${rows.length.toLocaleString("pt-BR")} registros`
            : "0 registros"}
        </span>
        <div>
          <button
            disabled={page === 0}
            aria-label="Página anterior"
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft size={15} />
          </button>
          <span>
            Página {page + 1} de {pages}
          </span>
          <button
            disabled={page + 1 >= pages}
            aria-label="Próxima página"
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </>
  );
}
