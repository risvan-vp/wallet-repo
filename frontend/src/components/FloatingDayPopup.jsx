import { PieChart, Pie, Cell, Tooltip } from "recharts";
import "../styles/FloatingDayPopup.css";

/* COLOR LOGIC */
function getColor(type, amount) {
  if (type === "income") {
    if (amount > 1000) return "#16a34a";
    if (amount > 500) return "#22c55e";
    return "#4ade80";
  } else {
    if (amount > 1000) return "#991b1b";
    if (amount > 500) return "#dc2626";
    return "#f87171";
  }
}

function FloatingDayPopup({ day, position, onClose }) {
  if (!day || !Array.isArray(day.data)) return null;

  // Group by category + type
  const categoryMap = {};

  day.data.forEach((t) => {
    const key = `${t.category} (${t.type})`;
    categoryMap[key] =
      (categoryMap[key] || 0) + Number(t.amount);
  });

  const chartData = Object.keys(categoryMap).map((key) => {
    const value = categoryMap[key];
    const type = key.includes("(income)")
      ? "income"
      : "expense";

    return {
      name: key,
      value,
      color: getColor(type, value),
      type,
    };
  });

  return (
    <div
      className="floating-popup animate-popup"
      style={{
        left: position?.x || 0,
        top: position?.y || 0,
      }}
    >
      <button className="close-btn" onClick={onClose}>
        ✕
      </button>

      <h5 className="popup-date">
        {new Date(day.date).toDateString()}
      </h5>

      {chartData.length === 0 ? (
        <p className="no-data">No data</p>
      ) : (
        <>
          {/* PIE CHART */}
          <PieChart width={190} height={170}>
            <Pie
              data={chartData}
              dataKey="value"
              outerRadius={65}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>

          {/* TABLE */}
          <table className="mini-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td
                    style={{
                      textAlign: "right",
                      color:
                        item.type === "income"
                          ? "#16a34a"
                          : "#dc2626",
                      fontWeight: 600,
                    }}
                  >
                    ₹{item.value.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default FloatingDayPopup;