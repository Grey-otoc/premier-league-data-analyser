import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function TopScoresBarChart() {
  const data = [
    { season: "2016", score: 24 },
    { season: "2017", score: 28 },
    { season: "2018", score: 31 },
    { season: "2019", score: 29 },
    { season: "2020", score: 33 },
    { season: "2021", score: 27 },
    { season: "2022", score: 35 },
    { season: "2023", score: 30 },
    { season: "2024", score: 36 },
  ];

  return (
    <div className="w-full h-full">

      <h2 className="text-base font-semibold text-gray-800 mb-1">
        Top Scores per Season
      </h2>
      <p className="text-xs text-gray-500 mb-3">
        Performance overview by season
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
          barSize={18} // thinner bars
        >
          <CartesianGrid strokeDasharray="2 2" vertical={false} />

          <XAxis
            dataKey="season"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={30}
          />

          <Tooltip
            contentStyle={{ fontSize: "12px", padding: "6px" }}
          />

          <Bar
            dataKey="score"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default TopScoresBarChart;