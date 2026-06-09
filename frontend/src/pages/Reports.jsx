import { useEffect, useState } from "react";
import API from "../services/api";
import ReportCharts from "../components/ReportCharts";
import "../styles/Reports.css";

function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [mode, setMode] = useState("daily");

  const today = new Date();

  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");

  const [selectedDate, setSelectedDate] = useState(`${y}-${m}-${d}`);
  const [selectedMonth, setSelectedMonth] = useState(`${y}-${m}`);
  const [selectedYear, setSelectedYear] = useState(y);

  const loadTransactions = async () => {
    const res = await API.get("/transactions");
    setTransactions(res.data);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div className="reports-page">
      <h2 className="reports-title">Financial Reports</h2>

      <div className="mode-toggle">
        {["daily", "monthly", "yearly"].map((m) => (
          <button
            key={m}
            className={mode === m ? "active" : ""}
            onClick={() => setMode(m)}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      <ReportCharts
        transactions={transactions}
        mode={mode}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        setSelectedDate={setSelectedDate}
        setSelectedMonth={setSelectedMonth}
        setSelectedYear={setSelectedYear}
        fetchTransactions={loadTransactions}
      />
    </div>
  );
}

export default Reports;