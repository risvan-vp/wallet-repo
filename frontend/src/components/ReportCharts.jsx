import { useMemo, useState } from "react";
import API from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/ReportCharts.css";

const CATEGORY_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
];

function ReportCharts({
  transactions,
  mode,
  selectedDate,
  selectedMonth,
  selectedYear,
  setSelectedDate,
  setSelectedMonth,
  setSelectedYear,
  fetchTransactions,
}) {
  const [editData, setEditData] = useState(null);

  /* ================= FILTER ================= */

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");

      const localDate = `${year}-${month}-${day}`;
      const localMonth = `${year}-${month}`;

      if (mode === "daily") return localDate === selectedDate;

      if (mode === "monthly") return localMonth === selectedMonth;

      if (mode === "yearly")
        return year.toString() === selectedYear.toString();

      return true;
    });
  }, [transactions, mode, selectedDate, selectedMonth, selectedYear]);

  /* ================= TOTALS ================= */

  const incomeTotal = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((a, t) => a + Number(t.amount), 0);

  const expenseTotal = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((a, t) => a + Number(t.amount), 0);

  const balance = incomeTotal - expenseTotal;

  /* ================= CATEGORY DATA ================= */

  const categoryData = useMemo(() => {
    const map = {};

    filteredTransactions.forEach((t) => {
      if (!map[t.category]) map[t.category] = 0;
      map[t.category] += Number(t.amount);
    });

    const total = Object.values(map).reduce((a, b) => a + b, 0);

    return Object.keys(map).map((key, index) => ({
      name: key,
      value: map[key],
      percentage: total ? ((map[key] / total) * 100).toFixed(1) : 0,
      fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }));
  }, [filteredTransactions]);

  /* ================= DAY-WISE STACKED ================= */

  const dayWiseData = useMemo(() => {
    if (mode !== "monthly") return [];

    const map = {};

    filteredTransactions.forEach((t) => {
      const day = new Date(t.date).getDate();

      if (!map[day]) map[day] = { day, income: 0, expense: 0 };

      if (t.type === "income")
        map[day].income += Number(t.amount);
      else map[day].expense += Number(t.amount);
    });

    return Object.values(map).sort((a, b) => a.day - b.day);
  }, [filteredTransactions, mode]);

  /* ================= DELETE ================= */

  const deleteTx = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;

    await API.delete(`/transactions/${id}`);
    fetchTransactions();
  };

  /* ================= UPDATE ================= */

  const updateTx = async () => {
    await API.put(`/transactions/${editData._id}`, {
      ...editData,
      amount: Number(editData.amount),
    });

    setEditData(null);
    fetchTransactions();
  };

  const renderCustomLabel = ({ name, value, percentage }) =>
    `${name} - ₹${value} (${percentage}%)`;

  return (
    <>
      {/* ================= DATE SELECTOR ================= */}

      <div className="report-date-selector">
        <div className="glass-date-wrapper">
          <FaCalendarAlt className="calendar-icon" />

          <DatePicker
            selected={
              mode === "daily"
                ? new Date(selectedDate)
                : mode === "monthly"
                ? new Date(selectedMonth + "-01")
                : new Date(selectedYear, 0)
            }
            onChange={(date) => {
              const y = date.getFullYear();
              const m = String(date.getMonth() + 1).padStart(2, "0");
              const d = String(date.getDate()).padStart(2, "0");

              if (mode === "daily") setSelectedDate(`${y}-${m}-${d}`);

              if (mode === "monthly") setSelectedMonth(`${y}-${m}`);

              if (mode === "yearly") setSelectedYear(y);
            }}
            showMonthYearPicker={mode === "monthly"}
            showYearPicker={mode === "yearly"}
            dateFormat={
              mode === "daily"
                ? "dd/MM/yyyy"
                : mode === "monthly"
                ? "MM/yyyy"
                : "yyyy"
            }
            className="glass-date-input"
          />
        </div>
      </div>

      {/* ================= SUMMARY ================= */}

      <div className="summary-cards">
        <div className="card income-card">
          <h4>Total Income</h4>
          <p>₹{incomeTotal}</p>
        </div>

        <div className="card expense-card">
          <h4>Total Expense</h4>
          <p>₹{expenseTotal}</p>
        </div>

        <div className="card balance-card">
          <h4>Net Balance</h4>
          <p>₹{balance}</p>
        </div>
      </div>

      {/* ================= PIE CHART ================= */}

      <div className="chart-box">
        <h3>Category Distribution</h3>

        <ResponsiveContainer width="100%" height={420}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              outerRadius={140}
              label={renderCustomLabel}
              labelLine={false}
              animationDuration={1200}
            >
              {categoryData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ================= DAY-WISE STACKED ================= */}

      {mode === "monthly" && (
        <div className="chart-box">
          <h3>Day Wise Income & Expense</h3>

          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={dayWiseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(v) => `₹${v}`} />
              <Legend />

              <Bar
                dataKey="income"
                stackId="a"
                fill="#10b981"
                animationDuration={1200}
              />

              <Bar
                dataKey="expense"
                stackId="a"
                fill="#ef4444"
                animationDuration={1200}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ================= TABLE ================= */}

      <div className="table-wrapper">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">No transactions found.</div>
        ) : (
          <table className="report-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t._id}>
                  <td>{t.type}</td>
                  <td>{t.category}</td>
                  <td>{t.description || "-"}</td>
                  <td>₹{t.amount}</td>
                  <td>{new Date(t.date).toLocaleDateString("en-GB")}</td>

                  <td>
                    <button
                      onClick={() =>
                        setEditData({
                          ...t,
                          date: new Date(t.date),
                        })
                      }
                    >
                      Edit
                    </button>

                    <button onClick={() => deleteTx(t._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= EDIT POPUP ================= */}

      {editData && (
        <div
          className="modal-overlay"
          onClick={() => setEditData(null)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Edit Transaction</h3>

            <select
              value={editData.type}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  type: e.target.value,
                })
              }
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <input
              type="number"
              value={editData.amount}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  amount: e.target.value,
                })
              }
            />

            <input
              value={editData.category}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  category: e.target.value,
                })
              }
            />

            <input
              value={editData.description || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  description: e.target.value,
                })
              }
            />

            <div className="glass-date-wrapper">
              <FaCalendarAlt className="calendar-icon" />

              <DatePicker
                selected={editData.date}
                onChange={(date) =>
                  setEditData({
                    ...editData,
                    date,
                  })
                }
                dateFormat="dd/MM/yyyy"
                className="glass-date-input"
              />
            </div>

            <div className="modal-actions">
              <button onClick={() => setEditData(null)}>Cancel</button>

              <button onClick={updateTx} className="save">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReportCharts;