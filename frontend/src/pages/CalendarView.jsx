import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import API from "../services/api";
import FloatingDayPopup from "../components/FloatingDayPopup";
import "../styles/CalendarView.css";

function CalendarView() {
  const [monthDate, setMonthDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [popup, setPopup] = useState(null);

  const calendarRef = useRef(null);

  // Load month transactions
  const loadMonthData = async (date) => {
    try {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const res = await API.get(`/transactions/monthly?month=${month}&year=${year}`);
      setTransactions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Calendar load failed", err);
      setTransactions([]);
    }
  };

  useEffect(() => {
    loadMonthData(monthDate);
  }, [monthDate]);

  // Normalize date for comparison
  const normalize = (d) => {
    const nd = new Date(d);
    nd.setHours(0, 0, 0, 0);
    return nd.getTime();
  };

  const getDayData = (date) => {
    return (Array.isArray(transactions) ? transactions : []).filter(
      (t) => normalize(t.date) === normalize(date)
    );
  };

  // Tile color logic
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";

    const data = getDayData(date);
    if (!data.length) return "";

    const expense = data
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + Number(t.amount), 0);
    const income = data
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + Number(t.amount), 0);

    if (expense > income) {
      if (expense > 5000) return "day-expense-high";
      if (expense > 2000) return "day-expense-medium";
      return "day-expense-low";
    }
    if (income > expense) {
      if (income > 5000) return "day-income-high";
      if (income > 2000) return "day-income-medium";
      return "day-income-low";
    }
    return "day-both";
  };

  // Day click popup
  const onDayClick = (date, e) => {
    if (!calendarRef.current) return;

    const rect = calendarRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = Math.max(16, Math.min(x, rect.width - 240));
    y = Math.max(16, Math.min(y, rect.height - 220));

    setPopup({
      date,
      data: getDayData(date),
      position: { x, y },
    });
  };

  return (
    <div className="calendar-page">
      <h2 className="calendar-title">📅 Income & Expense Calendar</h2>
      <div className="calendar-wrapper" ref={calendarRef}>
        <Calendar
          value={monthDate}
          onActiveStartDateChange={({ activeStartDate }) => {
            if (
              activeStartDate.getMonth() !== monthDate.getMonth() ||
              activeStartDate.getFullYear() !== monthDate.getFullYear()
            ) {
              setMonthDate(activeStartDate);
            }
          }}
          onClickDay={onDayClick}
          tileClassName={tileClassName}
        />

        {popup && (
          <FloatingDayPopup
            day={popup}
            position={popup.position}
            onClose={() => setPopup(null)}
          />
        )}
      </div>
    </div>
  );
}

export default CalendarView;