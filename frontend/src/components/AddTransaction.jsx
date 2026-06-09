import { useEffect, useState } from "react";
import API from "../services/api";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/AddTransaction.css";

function AddTransaction({ refresh, openCategory }) {
  const today = new Date();
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({
    type: "expense",
    category: "",
    amount: "",
    description: "",
    date: today,
  });

  const loadCategories = async () => {
    const res = await API.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const res = await API.post("/transactions/add", {
      ...data,
      amount: Number(data.amount),
      date: data.date,
    });

    if (res.data) refresh(res.data);

    setData({
      type: "expense",
      category: "",
      amount: "",
      description: "",
      date: new Date(),
    });
  };

  return (
    <form onSubmit={submit} className="add-box">
      <h4>Add Transaction</h4>

      <select
        value={data.type}
        onChange={(e) =>
          setData({ ...data, type: e.target.value, category: "" })
        }
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <div className="category-wrapper">
        <select
          required
          value={data.category}
          onChange={(e) => setData({ ...data, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories
            .filter((c) => c.type === data.type)
            .map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
        </select>

        <button
          type="button"
          className="add-category-mini"
          onClick={() =>
            openCategory((newCat) => setCategories((prev) => [...prev, newCat]))
          }
        >
          +
        </button>
      </div>

      <input
        type="number"
        placeholder="Amount"
        value={data.amount}
        onChange={(e) => setData({ ...data, amount: e.target.value })}
        required
      />

      <input
        placeholder="Description"
        value={data.description}
        onChange={(e) => setData({ ...data, description: e.target.value })}
      />

      <div className="glass-date-wrapper">
        <FaCalendarAlt className="calendar-icon" />
        <DatePicker
          selected={data.date}
          onChange={(date) => setData({ ...data, date })}
          dateFormat="dd/MM/yyyy"
          className="glass-date-input"
          popperClassName="glass-calendar"
          calendarClassName="glass-calendar"
        />
      </div>

      <button type="submit">Add Transaction</button>
    </form>
  );
}

export default AddTransaction;