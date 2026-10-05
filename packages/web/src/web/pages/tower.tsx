import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, Link } from "wouter";
import {
  Truck,
  Layers,
  LayoutDashboard,
  ChartNoAxesCombined,
  Warehouse,
  Upload,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  ArrowRight,
  CalendarDays,
  Bell,
  Search,
  Menu,
  X,
  CircleCheck,
  Clock,
  Package,
  TriangleAlert,
  TrendingUp,
  FileText,
  Wallet,
  Download,
  RotateCcw,
  SlidersHorizontal,
  HelpCircle,
  MapPin,
  Box,
  Percent,
  Users,
  ShieldCheck,
  CloudUpload,
  CheckCircle2,
  Info,
} from "lucide-react";
import {
  carriers,
  slugs,
  areas,
  records,
  clients,
  group,
  money,
  type RecordRow,
} from "../lib/demo";
import { ChartPanel } from "../components/tower-charts";
import { RecordTable, Badge } from "../components/record-table";
const icons = [LayoutDashboard, ChartNoAxesCombined, Warehouse, Upload];
type ModalData = {
  title: string;
  description: string;
  rows: RecordRow[];
  storage?: boolean;
  formula?: boolean;
  detail?: RecordRow;
  help?: boolean;
};
function Modal({ data, onClose }: { data: ModalData; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(data.detail);
  useEffect(() => {
    const before = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const nodes = ref.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled),a,input,select",
        );
        if (!nodes?.length) return;
        const first = nodes[0]!,
          last = nodes[nodes.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handler);
      before?.focus();
    };
  }, [onClose]);
  return (
    <div className="modal-overlay">
      <dialog open className="modal" aria-modal="true" aria-labelledby="modal-title" ref={ref}>
        <div className="modal-head">
          <div>
            <span className="eyebrow">DETALHAMENTO OPERACIONAL</span>
            <h2 id="modal-title">{data.title}</h2>
            <p>{data.description}</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Fechar modal">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {data.formula && (
            <div className="info-box">
              <Percent size={22} />
              <div>
                <strong>Exemplo de indicador • não é uma regra implementada</strong>
                <p>
                  Agendamentos após a previsão ÷ total de agendamentos × 100. Exemplo fictício: 12 ÷
                  80 × 100 = 15%. A fórmula definitiva será preservada na integração.
                </p>
              </div>
            </div>
          )}
          {data.help ? (
            <div className="help-content">
              <h3>Explore o protótipo</h3>
              <p>
                Selecione TRD, DeY, Tragetta ou Pacífico no menu e navegue entre Visão Geral,
                Análise, Gestão de Armazenagem e Importar Arquivos.
              </p>
              <p>
                Clique nos indicadores acionáveis e nos alertas para detalhar registros. Use os
                filtros para ajustar a base e a seta na tabela para ver uma nota.
              </p>
              <h3>Limites desta etapa</h3>
              <p>
                Todos os dados são fictícios. Séries temporais, percentual e média de atraso são
                ilustrativos. A importação não lê nem envia o conteúdo dos arquivos. Não há
                autenticação, persistência ou integração com códigos existentes.
              </p>
            </div>
          ) : selected ? (
            <div className="detail-grid">
              {Object.entries({
                "Nota Fiscal": selected.id,
                CTe: selected.cte,
                Cliente: selected.client,
                Transportadora: selected.carrier,
                Destino: `${selected.city} / ${selected.state}`,
                Previsão: selected.forecast,
                Agendamento: selected.schedule,
                "Limite do FreeTime": selected.limit,
                "Dias utilizados": `${selected.used} dias`,
                "Saldo FreeTime": `${selected.balance} dias`,
                Frete: money(selected.freight),
                Armazenagem: money(selected.cost),
                Status: selected.status,
                Alerta: selected.alert,
              }).map(([k, v]) => (
                <div key={k}>
                  <small>{k}</small>
                  <strong>{v}</strong>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="modal-summary">
                <FileText size={18} />
                <strong>{data.rows.length} registros demonstrativos</strong>
                <span>Dados fictícios · outubro de 2026</span>
              </div>
              <RecordTable rows={data.rows} storage={data.storage} onDetail={setSelected} />
            </>
          )}
        </div>
        <div className="modal-footer">
          <span>Ambiente de demonstração</span>
          <button className="btn primary" onClick={onClose}>
            Fechar detalhamento
          </button>
        </div>
      </dialog>
    </div>
  );
}
function ImportPage({ carrier }: { carrier: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [drag, setDrag] = useState(false);
  function pick(f?: File) {
    if (!f) return;
    if (!/\.(xlsx|xls|csv)$/i.test(f.name)) {
      setFile(null);
      setStatus("error");
      return;
    }
    setFile(f);
    setStatus("selected");
  }
  return (
    <>
      <div className="import-grid">
        <section className="panel import-panel">
          <div className="panel-heading">
            <div>
              <h3>Importar planilha · {carrier}</h3>
              <p>Centralize os registros da sua operação.</p>
            </div>
            <Upload size={20} />
          </div>
          <div
            className={`dropzone ${drag ? "dragging" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              pick(e.dataTransfer.files[0]);
            }}
          >
            <div className="upload-circle">
              <CloudUpload size={34} />
            </div>
            <h3>Arraste sua planilha para cá</h3>
            <p>ou selecione um arquivo no seu computador</p>
            <input
              ref={input}
              type="file"
              aria-label="Selecionar planilha"
              accept=".xlsx,.xls,.csv"
              hidden
              onChange={(e) => pick(e.target.files?.[0])}
            />
            <button className="btn primary" onClick={() => input.current?.click()}>
              <Upload size={16} />
              Selecionar planilha
            </button>
            <small>Formatos aceitos: XLSX, XLS e CSV</small>
          </div>
          {file && (
            <div className="selected-file">
              <FileText size={25} />
              <div>
                <strong>{file.name}</strong>
                <small>
                  {(file.size / 1024).toFixed(1)} KB ·{" "}
                  {status === "success" ? "Simulação concluída" : "Arquivo selecionado"}
                </small>
              </div>
              <CircleCheck size={20} />
            </div>
          )}
          {status === "error" && (
            <div className="message error" role="alert">
              <TriangleAlert size={18} />
              Formato não aceito. Selecione XLSX, XLS ou CSV.
            </div>
          )}
          {status === "success" && (
            <div className="message" aria-live="polite">
              <CheckCircle2 size={20} />
              <div>
                <strong>Simulação concluída com sucesso</strong>
                <p>320 registros de exemplo exibidos. O conteúdo do arquivo não foi lido.</p>
              </div>
            </div>
          )}
          <div className="import-actions">
            <button
              className="btn"
              disabled={!file}
              onClick={() => {
                setFile(null);
                setStatus("");
                if (input.current) input.current.value = "";
              }}
            >
              <RotateCcw size={15} />
              Limpar dados
            </button>
            <button
              className="btn primary"
              disabled={!file || status === "success"}
              onClick={() => setStatus("success")}
            >
              Importar e analisar <ArrowRight size={16} />
            </button>
          </div>
        </section>
        <aside>
          <section className="panel instructions">
            <span className="soft-icon">
              <Info size={22} />
            </span>
            <h3>Uma operação, uma base</h3>
            <p>Organize os dados de cada transportadora em seu próprio espaço.</p>
            <ol>
              <li>
                <strong>Selecione a transportadora</strong>
                <p>Você está no ambiente {carrier}.</p>
              </li>
              <li>
                <strong>Adicione sua planilha</strong>
                <p>XLSX, XLS ou CSV.</p>
              </li>
              <li>
                <strong>Confira o resultado</strong>
                <p>Acompanhe o status e os registros.</p>
              </li>
            </ol>
          </section>
          <div className="demo-notice">
            <ShieldCheck size={21} />
            <div>
              <strong>Protótipo visual</strong>
              <p>
                Nenhum arquivo é enviado ou processado. Importação, validação de colunas e cálculos
                serão integrados em uma próxima etapa.
              </p>
            </div>
          </div>
        </aside>
      </div>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Histórico de importações</h3>
            <p>Exemplo de como as últimas atualizações serão apresentadas.</p>
          </div>
          <span className="tag">Demonstrativo</span>
        </div>
        <div className="history-row">
          <FileText size={24} />
          <div>
            <strong>{carrier.toLowerCase()}_operacao_outubro.xlsx</strong>
            <small>05 out. 2026, 08:30 · exemplo fictício</small>
          </div>
          <span>320 registros</span>
          <Badge status="Entregue" />
        </div>
      </section>
    </>
  );
}
export default function Tower() {
  const [location, navigate] = useLocation();
  const parts = location.split("/");
  const cidx = slugs.indexOf(parts[2] || "");
  const home = cidx < 0;
  const carrier = home ? "Todas as transportadoras" : carriers[cidx]!;
  const area = home
    ? "visao-geral"
    : areas.some((a) => a.id === parts[3])
      ? parts[3]!
      : "visao-geral";
  const [expanded, setExpanded] = useState(home ? 0 : cidx);
  const [mobile, setMobile] = useState(false);
  const [modal, setModal] = useState<ModalData | null>(null);
  const [query, setQuery] = useState("");
  const [client, setClient] = useState("");
  const [state, setState] = useState("");
  const [status, setStatus] = useState("");
  const [month, setMonth] = useState("10");
  const [period, setPeriod] = useState("month");
  const [toast, setToast] = useState("");
  useEffect(() => {
    setQuery("");
    setClient("");
    setState("");
    setStatus("");
    setMonth("10");
    setMobile(false);
    if (cidx >= 0) setExpanded(cidx);
  }, [location, cidx]);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 4500);
      return () => clearTimeout(t);
    }
  }, [toast]);
  const base = useMemo(() => records.filter((r) => home || r.carrier === carrier), [home, carrier]);
  const filtered = useMemo(
    () =>
      base.filter(
        (r) =>
          (!month || r.month === month) &&
          (!query ||
            [r.id, r.cte, r.client, r.city].some((v) =>
              v.toLowerCase().includes(query.toLowerCase()),
            )) &&
          (!client || r.client === client) &&
          (!state || r.state === state) &&
          (!status || r.status === status) &&
          (period !== "day" || r.forecast === "05/10/2026"),
      ),
    [base, query, client, state, status, month, period],
  );
  const pending = filtered.filter((r) => r.status === "Pendente"),
    scheduled = filtered.filter((r) => r.status === "Agendado"),
    late = filtered.filter((r) => r.status === "Atrasado"),
    stored = filtered.filter((r) => r.cost > 0),
    near = filtered.filter((r) => r.balance >= 0 && r.balance <= 2);
  const total = filtered.reduce((s, r) => s + r.freight, 0);
  const storeTotal = stored.reduce((s, r) => s + r.cost, 0);
  const open = (title: string, rows: RecordRow[], storage = false, formula = false) =>
    setModal({
      title,
      description: `Registros de ${carrier.toLowerCase()} no período selecionado. Explore os exemplos abaixo.`,
      rows,
      storage,
      formula,
    });
  const detail = (r: RecordRow) =>
    setModal({
      title: `Nota Fiscal ${r.id}`,
      description: "Informações do transporte e acompanhamento do FreeTime.",
      rows: [r],
      detail: r,
    });
  const kpis =
    area === "armazenagem"
      ? [
          {
            name: "Notas com armazenagem",
            value: stored.length,
            icon: FileText,
            desc: "Registros com custo associado",
            click: () => open("Notas com armazenagem", stored, true),
          },
          {
            name: "Total de armazenagem",
            value: money(storeTotal),
            icon: Wallet,
            desc: "Custo acumulado no período",
          },
          {
            name: "Média de dias armazenados",
            value: `${stored.length ? (stored.reduce((s, r) => s + r.days, 0) / stored.length).toFixed(1).replace(".", ",") : 0} dias`,
            icon: Clock,
            desc: "Por nota com armazenagem",
          },
          {
            name: "Custo médio diário",
            value: money(stored.length ? storeTotal / stored.reduce((s, r) => s + r.days, 0) : 0),
            icon: TrendingUp,
            desc: "Média ilustrativa dos registros",
          },
          {
            name: "Clientes impactados",
            value: new Set(stored.map((r) => r.client)).size,
            icon: Users,
            desc: "Clientes com custo de armazenagem",
            click: () => open("Clientes impactados", stored, true),
          },
          {
            name: "Próximos ao limite",
            value: near.length,
            icon: TriangleAlert,
            desc: "Até 2 dias para vencer",
            tone: "amber",
            click: () => open("FreeTime próximo do limite", near, true),
          },
        ]
      : [
          {
            name: "Total de CTes",
            value: filtered.length.toLocaleString("pt-BR"),
            icon: FileText,
            desc: "Registros na operação",
            trend: "Base demonstrativa",
          },
          {
            name: "Entregas pendentes",
            value: pending.length,
            icon: Package,
            desc: "Aguardando conclusão",
            tone: "amber",
            click: () => open("Entregas pendentes", pending),
          },
          {
            name: "Entregas agendadas",
            value: scheduled.length,
            icon: CalendarDays,
            desc: "Com agendamento confirmado",
            click: () => open("Agendamentos", scheduled),
          },
          {
            name: "Entregas atrasadas",
            value: late.length,
            icon: TriangleAlert,
            desc: "Precisam de acompanhamento",
            tone: "red",
            click: () => open("Entregas atrasadas", late),
          },
          {
            name: "Agendamentos atrasados",
            value: "15,0%",
            icon: Percent,
            desc: "Percentual ilustrativo",
            click: () => open("Percentual de agendamento atrasado", late, false, true),
          },
          {
            name: "Média de atraso",
            value: "2,4 dias",
            icon: Clock,
            desc: "Média ilustrativa do período",
          },
          {
            name: "Valor total de frete",
            value: money(total),
            icon: Wallet,
            desc: "Total no período selecionado",
          },
          {
            name: "Valor de frete pendente",
            value: money(pending.reduce((s, r) => s + r.freight, 0)),
            icon: Box,
            desc: "Entregas ainda não concluídas",
          },
        ];
  const trend = Array.from({ length: 12 }, (_, i) => ({
    name: `${String(i + 24 > 30 ? i - 6 : i + 24).padStart(2, "0")} ${i < 7 ? "set" : "out"}`,
    value: [64, 82, 75, 105, 91, 124, 104, 119, 137, 120, 158, 144][i]! * (home ? 1 : 0.3),
  }));
  const reset = () => {
    setQuery("");
    setClient("");
    setState("");
    setStatus("");
    setMonth("10");
    setPeriod("month");
  };
  const exportDemo = () => {
    const blob = new Blob(
      [
        "﻿Nota Fiscal;Cliente;Transportadora;Estado;Status;Frete\n" +
          filtered
            .map((r) => `${r.id};${r.client};${r.carrier};${r.state};${r.status};${r.freight}`)
            .join("\n"),
      ],
      { type: "text/csv;charset=utf-8" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "logistics-dados-ficticios.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    setToast("Dados fictícios exportados em CSV.");
  };
  return (
    <div className="app-shell">
      <a className="skip" href="#main">
        Ir para o conteúdo
      </a>
      {mobile && (
        <button
          className="sidebar-overlay"
          aria-label="Fechar menu"
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={`sidebar ${mobile ? "is-open" : ""}`}>
        <Link to="/" className="brand">
          <span className="brand-icon">
            <Layers size={24} />
          </span>
          <div>
            LOGISTICS<span>CONTROL TOWER</span>
          </div>
        </Link>
        <div className="sidebar-label">WORKSPACE LOGÍSTICO</div>
        <Link to="/" className={`nav-home ${home ? "active" : ""}`}>
          <LayoutDashboard size={18} />
          Painel executivo<span className="nav-new">Geral</span>
        </Link>
        <div className="sidebar-label carrier-label">
          TRANSPORTADORAS <span>04</span>
        </div>
        <nav aria-label="Transportadoras">
          {carriers.map((c, i) => (
            <div className="carrier-nav" key={c}>
              <button
                className={`carrier-button ${!home && cidx === i ? "selected" : ""}`}
                onClick={() => {
                  setExpanded(expanded === i ? -1 : i);
                  if (home || cidx !== i) navigate(`/transportadora/${slugs[i]}/visao-geral`);
                }}
                aria-expanded={expanded === i}
              >
                <Truck size={18} />
                <span>{c}</span>
                {i === 0 && <span className="carrier-count">320</span>}
                <ChevronDown size={14} className={expanded === i ? "rotated" : ""} />
              </button>
              {expanded === i && (
                <div className="subnav">
                  {areas.map((a, j) => {
                    const Icon = icons[j]!;
                    return (
                      <Link
                        key={a.id}
                        to={`/transportadora/${slugs[i]}/${a.id}`}
                        className={!home && cidx === i && area === a.id ? "active" : ""}
                      >
                        <Icon size={15} />
                        {a.name}
                        {!home && cidx === i && area === a.id && <span className="active-dot" />}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="operation-status">
            <span className="live-dot" />
            <div>
              <strong>Operação conectada</strong>
              <small>Ambiente de demonstração</small>
            </div>
          </div>
          <button
            className="help-button"
            onClick={() =>
              setModal({
                title: "Sobre este protótipo",
                description: "Uma visão integrada para tomar melhores decisões.",
                rows: [],
                help: true,
              })
            }
          >
            <HelpCircle size={17} />
            Central de ajuda
            <ArrowUpRight size={15} />
          </button>
          <div className="user">
            <div className="avatar">AL</div>
            <div>
              <strong>Ana Lima</strong>
              <small>Gestão logística · exemplo</small>
            </div>
            <ShieldCheck size={17} />
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setMobile(!mobile)}
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>
          <div className="header-title">
            <strong>Logistics Control Tower</strong>
            <small>Gestão integrada de transporte, prazo e armazenagem</small>
          </div>
          <div className="header-right">
            <span className="environment">
              <span className="live-dot" />
              Sistema ativo
            </span>
            <div className="reference-date">
              <CalendarDays size={16} />
              <div>
                <small>DATA DE REFERÊNCIA</small>
                <strong>05 out. 2026</strong>
              </div>
            </div>
            <button
              className="notification"
              aria-label="Ver alertas operacionais"
              onClick={() =>
                open(
                  "Alertas operacionais",
                  base.filter((r) => r.alert !== "Sem alertas"),
                  true,
                )
              }
            >
              <Bell size={20} />
              <span />
            </button>
            <div className="avatar light">AL</div>
          </div>
        </header>
        <main id="main">
          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={12} />
            <span>{home ? "Painel executivo" : carrier}</span>
            {!home && (
              <>
                <ChevronRight size={12} />
                <strong>{areas.find((a) => a.id === area)?.name}</strong>
              </>
            )}
            <span className="prototype-label">Protótipo · dados fictícios</span>
          </div>
          {area === "visao-geral" ? (
            <section className="hero">
              <div className="hero-content">
                <div className="hero-eyebrow">
                  <span />
                  INTELIGÊNCIA LOGÍSTICA, EM UM SÓ LUGAR
                </div>
                <h1>{home ? "Logistics Control Tower" : `Visão Geral · ${carrier}`}</h1>
                <p>
                  Mais visibilidade. Menos imprevistos.
                  <br />
                  Agendamentos, prazos, FreeTime e armazenagem sob controle.
                </p>
                <div className="hero-footer">
                  <span>
                    <span className="live-dot" />
                    Visão{" "}
                    {home ? "integrada de 4 transportadoras" : "operacional da transportadora"}
                  </span>
                  <span className="hero-divider" />
                  Última atualização: 05 out., 08:30 <span className="hero-demo">Demo</span>
                </div>
              </div>
              <div className="route-art" aria-hidden="true">
                <div className="art-orbit one" />
                <div className="art-orbit two" />
                <div className="art-orbit three" />
                <svg viewBox="0 0 330 200">
                  <path
                    d="M35 130L107 75L184 122L275 54"
                    stroke="#82BC96"
                    strokeWidth="1.5"
                    strokeDasharray="5 6"
                    fill="none"
                  />
                  <path
                    d="M107 75L144 180L184 122L299 147"
                    stroke="#82BC96"
                    strokeWidth="1"
                    strokeDasharray="5 6"
                    fill="none"
                  />
                </svg>
                <span className="art-point p1">
                  <Warehouse size={25} />
                </span>
                <span className="art-point p2">
                  <Truck size={28} />
                </span>
                <span className="art-point p3">
                  <MapPin size={24} />
                </span>
                <div className="art-chip">
                  <CheckCircle2 size={14} />
                  Operação em movimento
                </div>
              </div>
            </section>
          ) : (
            <div className="page-title">
              <div>
                <span className="eyebrow">{carrier} / INTELIGÊNCIA OPERACIONAL</span>
                <h1>{areas.find((a) => a.id === area)?.name}</h1>
                <p>
                  {area === "analise"
                    ? "Transforme dados da operação em uma visão clara de desempenho."
                    : area === "armazenagem"
                      ? "Antecipe limites de FreeTime e acompanhe o impacto financeiro."
                      : "Atualize a base da transportadora com segurança e organização."}
                </p>
              </div>
              <span className="tag">
                <Truck size={14} />
                {carrier}
              </span>
            </div>
          )}
          {area === "importar" ? (
            <ImportPage key={carrier} carrier={carrier} />
          ) : (
            <>
              <div className="section-top">
                <div>
                  <h2>
                    {area === "visao-geral"
                      ? "Panorama da operação"
                      : area === "armazenagem"
                        ? "Controle de armazenagem"
                        : "Desempenho da operação"}
                  </h2>
                  <p>
                    {area === "visao-geral"
                      ? "Os principais indicadores para acompanhar o seu dia."
                      : "Indicadores demonstrativos do período selecionado."}
                  </p>
                </div>
                <div className="section-actions">
                  <div className="period-toggle">
                    <button
                      className={period === "day" ? "active" : ""}
                      onClick={() => setPeriod("day")}
                    >
                      Hoje
                    </button>
                    <button
                      className={period === "month" ? "active" : ""}
                      onClick={() => setPeriod("month")}
                    >
                      Este mês
                    </button>
                  </div>
                  <label className="period-select">
                    <CalendarDays size={15} />
                    <select
                      aria-label="Mês de referência"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                    >
                      <option value="10">Outubro, 2026</option>
                      <option value="09">Setembro, 2026</option>
                      <option value="">Todos os meses</option>
                    </select>
                  </label>
                  <button className="btn export-btn" onClick={exportDemo}>
                    <Download size={15} />
                    Exportar
                  </button>
                </div>
              </div>
              {area !== "analise" && (
                <div className={`kpi-grid ${area === "armazenagem" ? "storage-kpis" : ""}`}>
                  {kpis.map((k, i) => {
                    const Icon = k.icon;
                    return (
                      <button
                        key={k.name}
                        className={`kpi ${k.tone || ""} ${k.click ? "clickable" : ""}`}
                        disabled={!k.click}
                        onClick={k.click}
                      >
                        <div className="kpi-top">
                          <span>{k.name}</span>
                          <Icon size={16} />
                        </div>
                        <strong className="kpi-value">{k.value}</strong>
                        <div className="kpi-bottom">
                          <span>{k.desc}</span>
                          {k.click && <ArrowUpRight size={14} />}
                        </div>
                        {i === 0 && area === "visao-geral" && (
                          <div className="kpi-base">
                            <span />
                            Base demonstrativa atualizada
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
              {area === "visao-geral" && (
                <>
                  <div className="overview-charts">
                    <ChartPanel
                      title="Evolução das entregas"
                      description="Volume diário de entregas no período · exemplo fictício"
                      type="area"
                      data={trend}
                    />
                    <ChartPanel
                      title="Distribuição por status"
                      description="Como está a operação neste momento"
                      type="donut"
                      data={group(filtered, "status")}
                    />
                    <section className="panel alerts-panel">
                      <div className="panel-heading">
                        <div>
                          <h3>Radar de atenção</h3>
                          <p>O que precisa do seu olhar</p>
                        </div>
                        <span className="alert-count">3</span>
                      </div>
                      <button
                        className="radar-item"
                        onClick={() => open("FreeTime excedido", stored, true)}
                      >
                        <span className="radar-icon red">
                          <TriangleAlert size={18} />
                        </span>
                        <div>
                          <strong>FreeTime excedido</strong>
                          <p>{stored.length} notas gerando armazenagem</p>
                          <small>Prioridade alta</small>
                        </div>
                        <ChevronRight size={15} />
                      </button>
                      <button
                        className="radar-item"
                        onClick={() => open("FreeTime próximo do vencimento", near, true)}
                      >
                        <span className="radar-icon amber">
                          <Clock size={18} />
                        </span>
                        <div>
                          <strong>FreeTime próximo do limite</strong>
                          <p>{near.length} registros para acompanhar</p>
                          <small>Atenção nos próximos 2 dias</small>
                        </div>
                        <ChevronRight size={15} />
                      </button>
                      <button
                        className="radar-item"
                        onClick={() => open("Registros sem agendamento", pending)}
                      >
                        <span className="radar-icon green">
                          <CalendarDays size={18} />
                        </span>
                        <div>
                          <strong>Sem agendamento</strong>
                          <p>{pending.length} entregas aguardando definição</p>
                          <small>Ação operacional</small>
                        </div>
                        <ChevronRight size={15} />
                      </button>
                      <button
                        className="radar-link"
                        onClick={() =>
                          open(
                            "Todos os alertas",
                            filtered.filter((r) => r.alert !== "Sem alertas"),
                            true,
                          )
                        }
                      >
                        Ver todos os alertas <ArrowRight size={15} />
                      </button>
                    </section>
                  </div>
                  {home && (
                    <div className="carrier-strip">
                      {carriers.map((c, i) => (
                        <Link key={c} to={`/transportadora/${slugs[i]}/visao-geral`}>
                          <span className="soft-icon">
                            <Truck size={18} />
                          </span>
                          <div>
                            <strong>{c}</strong>
                            <small>
                              {base.filter((r) => r.carrier === c && r.month === month).length}{" "}
                              registros no período
                            </small>
                          </div>
                          <ArrowUpRight size={17} />
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
              {area === "analise" && (
                <div className="analysis-grid">
                  <ChartPanel
                    title="Entregas por cliente"
                    description="Volume de registros por cliente"
                    data={group(filtered, "client")}
                  />
                  <ChartPanel
                    title="Entregas por estado"
                    description="Distribuição geográfica da operação"
                    data={group(filtered, "state")}
                  />
                  <ChartPanel
                    title="Entregas por região"
                    description="Representatividade regional"
                    type="pie"
                    data={group(filtered, "region")}
                  />
                  <ChartPanel
                    title="Clientes com mais atrasos"
                    description="Clientes que exigem acompanhamento"
                    data={group(late, "client")}
                  />
                  <ChartPanel
                    title="Atrasos por estado"
                    description="Concentração de entregas atrasadas"
                    data={group(late, "state")}
                  />
                  <ChartPanel
                    title="Distribuição por status"
                    description="Situação atual dos registros"
                    type="donut"
                    data={group(filtered, "status")}
                  />
                  <ChartPanel
                    title="Evolução diária das entregas"
                    description="Tendência diária · série fictícia"
                    type="line"
                    data={trend}
                  />
                  <ChartPanel
                    title="Evolução diária dos atrasos"
                    description="Acompanhamento diário · série fictícia"
                    type="line"
                    data={trend.map((d) => ({ ...d, value: Math.round(d.value * 0.12) }))}
                  />
                  <ChartPanel
                    title="Armazenagem por cliente"
                    description="Impacto financeiro acumulado"
                    financial
                    data={group(stored, "client", "cost")}
                  />
                  <ChartPanel
                    title="Representatividade por cliente"
                    description="Participação de cada cliente no volume"
                    type="donut"
                    data={group(filtered, "client")}
                  />
                </div>
              )}
              {area === "armazenagem" && (
                <div className="storage-alerts">
                  {[
                    {
                      t: "Alto custo de armazenagem",
                      r: stored.filter((r) => r.cost > 700),
                      color: "red",
                    },
                    { t: "Registro sem agendamento", r: pending, color: "amber" },
                    { t: "FreeTime próximo do vencimento", r: near, color: "amber" },
                    { t: "FreeTime excedido", r: stored, color: "red" },
                    { t: "Agendamento após a previsão", r: late, color: "green" },
                  ].map((a) => (
                    <button
                      key={a.t}
                      className={`storage-alert ${a.color}`}
                      onClick={() => open(a.t, a.r, true)}
                    >
                      <TriangleAlert size={17} />
                      <strong>{a.r.length}</strong>
                      <span>{a.t}</span>
                      <ArrowUpRight size={14} />
                    </button>
                  ))}
                </div>
              )}
              <section className="panel table-panel">
                <div className="panel-heading">
                  <div>
                    <h3>
                      {area === "armazenagem"
                        ? "Detalhamento de armazenagem"
                        : area === "analise"
                          ? "Base analítica de entregas"
                          : "Acompanhamento de entregas"}
                    </h3>
                    <p>
                      {area === "armazenagem"
                        ? "Visibilidade de prazos, saldos de FreeTime e custos por nota."
                        : "Explore os registros e encontre o que precisa acompanhar."}
                    </p>
                  </div>
                  <span className="table-total">
                    {filtered.length} registros <SlidersHorizontal size={15} />
                  </span>
                </div>
                <div className="filters">
                  <label className="search-field">
                    <Search size={16} />
                    <input
                      aria-label="Buscar por Nota Fiscal, CTe ou cliente"
                      placeholder={
                        area === "armazenagem"
                          ? "Buscar por Nota Fiscal..."
                          : "Buscar NF, CTe ou cliente..."
                      }
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </label>
                  <label>
                    <span className="sr-only">Cliente</span>
                    <select value={client} onChange={(e) => setClient(e.target.value)}>
                      <option value="">Todos os clientes</option>
                      {clients.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="sr-only">Estado</span>
                    <select value={state} onChange={(e) => setState(e.target.value)}>
                      <option value="">Todos os estados</option>
                      {["SP", "PR", "RJ", "MG", "BA", "GO", "AM"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="sr-only">Status</span>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="">Todos os status</option>
                      {["Entregue", "Agendado", "Pendente", "Atrasado"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <button className="clear-filters" onClick={reset}>
                    <RotateCcw size={14} />
                    Limpar filtros
                  </button>
                </div>
                <RecordTable rows={filtered} storage={area === "armazenagem"} onDetail={detail} />
              </section>
              {area === "armazenagem" && (
                <div className="storage-charts">
                  <ChartPanel
                    title="Top 10 clientes com maior custo"
                    description="Clientes com armazenagem no período · 8 no exemplo"
                    data={group(stored, "client", "cost")}
                    financial
                  />
                  <ChartPanel
                    title="Armazenagem por estado"
                    description="Impacto financeiro por UF"
                    data={group(stored, "state", "cost")}
                    financial
                  />
                  <ChartPanel
                    title="Mês atual × mês anterior"
                    description="Comparação semanal ilustrativa"
                    type="compare"
                    data={[
                      { name: "Semana 1", value: 14600, previous: 12300 },
                      { name: "Semana 2", value: 18200, previous: 15100 },
                      { name: "Semana 3", value: 12400, previous: 16400 },
                      { name: "Semana 4", value: 15800, previous: 18700 },
                    ]}
                    financial
                  />
                  <ChartPanel
                    title="Representatividade por cliente"
                    description="Participação nos custos de armazenagem"
                    type="donut"
                    data={group(stored, "client", "cost")}
                    financial
                  />
                </div>
              )}
            </>
          )}
          <footer className="page-footer">
            <span>
              <Layers size={13} />
              Logistics Control Tower <span className="footer-sep">/</span>Visibilidade que move a
              operação.
            </span>
            <span>
              Ambiente demonstrativo <span className="live-dot" />
            </span>
          </footer>
        </main>
      </div>
      {modal && <Modal data={modal} onClose={() => setModal(null)} />}{" "}
      {toast && (
        <div className="toast" aria-live="polite">
          <CheckCircle2 size={18} />
          {toast}
          <button aria-label="Fechar mensagem" onClick={() => setToast("")}>
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
