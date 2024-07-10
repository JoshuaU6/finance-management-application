import { useCallback } from "react";
import CountUp from "react-countup";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";
import type { TimeFrame } from "@/lib/types";
import type { HistoryData } from "@/app/api/history-data/route";

interface Props {
  historyData: HistoryData[];
  timeFrame: TimeFrame;
  formatter: Intl.NumberFormat;
}

export const HistoryChart = ({ historyData, timeFrame, formatter }: Props) => {
  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <BarChart height={300} data={historyData} barCategoryGap={5}>
        <defs>
          <linearGradient id="incomeBar" x1={"0"} y1={"0"} x2={"0"} y2={"1"}>
            <stop offset={"0"} stopColor="#10b981" stopOpacity={"1"} />

            <stop offset={"1"} stopColor="#10b981" stopOpacity={"0"} />
          </linearGradient>

          <linearGradient id="expenseBar" x1={"0"} y1={"0"} x2={"0"} y2={"1"}>
            <stop offset={"0"} stopColor="#ef4444" stopOpacity={"1"} />

            <stop offset={"1"} stopColor="#ef4444" stopOpacity={"0"} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray={"5 5"}
          strokeOpacity={"0.2"}
          vertical={false}
        />

        <XAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          padding={{ left: 5, right: 5 }}
          dataKey={(data) => {
            const { year, month, day } = data;
            const date = new Date(year, month, day || 1);

            if (timeFrame === "year") {
              return date.toLocaleDateString("default", {
                month: "long",
              });
            }
            return date.toLocaleDateString("default", {
              day: "2-digit",
            });
          }}
        />

        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />

        <Bar
          dataKey={"income"}
          label="Income"
          fill="url(#incomeBar)"
          radius={4}
          className="cursor-pointer"
        />
        <Bar
          dataKey={"expense"}
          label="Expense"
          fill="url(#expenseBar)"
          radius={4}
          className="cursor-pointer"
        />

        <Tooltip
          cursor={{ opacity: 0.1 }}
          content={(props) => (
            <CustomTooltip formatter={formatter} {...props} />
          )}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip = ({ active, payload, formatter }: any) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const { expense, income } = data;

  return (
    <div className="min-w-[300px] rounded border bg-background p-4 ">
      <TooltipRow
        formatter={formatter}
        label="Expense"
        value={expense}
        bgColor="bg-red-500"
        textColor="text-red-500"
      />
      <TooltipRow
        formatter={formatter}
        label="Income"
        value={income}
        bgColor="bg-emerald-500"
        textColor="text-emerald-500"
      />
      <TooltipRow
        formatter={formatter}
        label="Balance"
        value={income - expense}
        bgColor="bg-gray-100"
        textColor="text-foreground"
      />
    </div>
  );
};

const TooltipRow = ({
  label,
  value,
  bgColor,
  textColor,
  formatter,
}: {
  label: string;
  value: number;
  bgColor: string;
  textColor: string;
  formatter: Intl.NumberFormat;
}) => {
  const formattingFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );
  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-4 w-4 rounded-full", bgColor)} />
      <div className="flex w-full justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn("text-sm font-bold", textColor)}>
          <CountUp
            duration={0.5}
            preserveValue
            end={value}
            decimals={0}
            formattingFn={formattingFn}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
};
