import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function UserRequestsChart() {
  const data = [
    { day: "Mon", requests: 12 },
    { day: "Tue", requests: 19 },
    { day: "Wed", requests: 8 },
    { day: "Thu", requests: 15 },
    { day: "Fri", requests: 22 },
    { day: "Sat", requests: 10 },
    { day: "Sun", requests: 18 },
  ];

  return (
    <div className="w-full h-full px-4 py-3">

      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-800">
              Requests
            </h2>
            <p class="text-sm text-gray-500">
              Last 7 days
            </p>
          </div>
        </div>

        {/* Example stat */}
        <span className="text-sm font-semibold text-blue-600">
          +12%
        </span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>

          <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            width={30}
          />

          <Tooltip
            contentStyle={{
              border: "none",
              borderRadius: "6px",
              fontSize: "12px",
              padding: "6px 8px",
            }}
          />

          <defs>
            <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="requests"
            stroke="#2563eb"
            strokeWidth={2}
            fill="url(#colorReq)"
            dot={false}
            activeDot={{ r: 4 }}
          />

        </AreaChart>
      </ResponsiveContainer>

    </div>
  );
}

export default UserRequestsChart;