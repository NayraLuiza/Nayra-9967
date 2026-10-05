import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { MoreHorizontal } from "lucide-react";
const palette = [
  "#087A55",
  "#5C9F84",
  "#A5CCBA",
  "#D6E7DE",
  "#D4A351",
  "#778C83",
  "#346952",
  "#BAC9C2",
];
export function ChartPanel({
  title,
  description,
  type = "bar",
  data,
  financial = false,
}: {
  title: string;
  description: string;
  type?: string;
  data: { name: string; value: number; previous?: number }[];
  financial?: boolean;
}) {
  const format = (v: number) =>
    financial ? "R$ " + v.toLocaleString("pt-BR") : v.toLocaleString("pt-BR");
  return (
    <section className="panel chart-panel">
      <div className="panel-heading">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <MoreHorizontal size={19} aria-hidden="true" />
      </div>
      <section
        className="chart-area"
        aria-label={`${title}: ${data.map((d) => `${d.name}, ${format(d.value)}`).join("; ")}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          {type === "donut" || type === "pie" ? (
            <PieChart>
              <Pie
                isAnimationActive={false}
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={type === "donut" ? 64 : 0}
                outerRadius={91}
                paddingAngle={type === "donut" ? 4 : 1}
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={palette[i % palette.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => format(Number(v))} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          ) : type === "line" || type === "area" ? (
            <AreaChart data={data} margin={{ top: 18, right: 12, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#087A55" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#087A55" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E8EEEB" vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#65736C" }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#65736C" }} />
              <Tooltip formatter={(v) => [format(Number(v)), "Entregas"]} />
              <Area
                isAnimationActive={false}
                type="monotone"
                dataKey="value"
                name="Registros"
                stroke="#087A55"
                strokeWidth={2.5}
                fill="url(#chartFill)"
              />
              <Legend iconType="plainline" wrapperStyle={{ fontSize: 11 }} />
            </AreaChart>
          ) : type === "compare" ? (
            <LineChart data={data}>
              <CartesianGrid stroke="#E8EEEB" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} width={50} />
              <Tooltip formatter={(v) => format(Number(v))} />
              <Line dataKey="value" name="Outubro" stroke="#087A55" strokeWidth={2} />
              <Line dataKey="previous" name="Setembro" stroke="#A5CCBA" strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </LineChart>
          ) : (
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 35, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="#E8EEEB" horizontal={false} />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#65736C" }}
                tickFormatter={(v) => (financial ? `${Math.round(v / 1000)} mil` : v)}
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={82}
                tick={{ fontSize: 11, fill: "#65736C" }}
              />
              <Tooltip
                formatter={(v) => [format(Number(v)), financial ? "Armazenagem" : "Registros"]}
              />
              <Bar
                isAnimationActive={false}
                dataKey="value"
                name={financial ? "Armazenagem (R$)" : "Registros"}
                fill="#087A55"
                radius={[0, 4, 4, 0]}
                barSize={14}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? "#087A55" : i === 1 ? "#3A8E6F" : "#8CBBA6"} />
                ))}
              </Bar>
              <Legend iconType="square" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </section>
    </section>
  );
}
