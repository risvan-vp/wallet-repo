import { useEffect, useState } from "react";
import AddTransaction from "../components/AddTransaction";
import AddCategoryPopup from "../components/AddCategoryPopup";
import API from "../services/api";
import DatePicker from "react-datepicker"; // ✅ FIX ADDED
import "react-datepicker/dist/react-datepicker.css"; // ✅ FIX ADDED
import "../styles/Dashboard.css";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [editData, setEditData] = useState(null);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [highlightedTx, setHighlightedTx] = useState(null);
  const [categoryAddedCallback, setCategoryAddedCallback] = useState(null);

  // ================= LOAD =================
  const loadTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      const sorted = Array.isArray(res.data)
        ? res.data.sort((a, b) => new Date(b.date) - new Date(a.date))
        : [];
      setTransactions(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    await API.delete(`/transactions/${id}`);
    loadTransactions();
  };

  // ================= OPEN EDIT =================
  const openEdit = (t) =>
    setEditData({
      ...t,
      date: new Date(t.date), // ✅ ensure Date object
    });

  // ================= UPDATE =================
  const handleUpdate = async () => {
    await API.put(`/transactions/${editData._id}`, {
      ...editData,
      amount: Number(editData.amount), // ✅ ensure number
    });

    setEditData(null);
    loadTransactions();
  };

  const formatDisplayDate = (date) =>
    new Date(date).toLocaleDateString("en-GB");

  return (
    <div className="dashboard-root">
      <h2 className="dashboard-title">Dashboard</h2>

      {/* ================= ADD TRANSACTION ================= */}
      <AddTransaction
        refresh={(newTx) => {
          if (newTx) {
            setTransactions((prev) => [newTx, ...prev]);
            setHighlightedTx(newTx._id);
            setTimeout(() => setHighlightedTx(null), 2000);
          } else {
            loadTransactions();
          }
        }}
        openCategory={(callback) => {
          setShowCategoryPopup(true);
          setCategoryAddedCallback(() => callback);
        }}
      />

      {/* ================= LATEST TRANSACTIONS ================= */}
      <div className="latest-box">
        <h4>Latest Transactions</h4>
        <ul className="latest-list">
          {transactions.map((t) => (
            <li
              key={t._id}
              className={`latest-item ${
                highlightedTx === t._id ? "highlight" : ""
              }`}
            >
              <div>
                <div className="category">{t.category}</div>
                {t.description && (
                  <div className="description">{t.description}</div>
                )}
                <div className="date">
                  {formatDisplayDate(t.date)}
                </div>
              </div>

              <div className="right-section">
                <span
                  className={
                    t.type === "expense"
                      ? "amount expense"
                      : "amount income"
                  }
                >
                  {t.type === "expense" ? "-" : "+"}₹{t.amount}
                </span>

                <button
                  className="icon-btn edit"
                  onClick={() => openEdit(t)}
                >
                  ✏️
                </button>

                <button
                  className="icon-btn delete"
                  onClick={() => handleDelete(t._id)}
                >
                  🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ================= EDIT MODAL ================= */}
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
                setEditData({ ...editData, type: e.target.value })
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
              <DatePicker
                selected={editData.date}
                onChange={(date) =>
                  setEditData({ ...editData, date })
                }
                dateFormat="dd/MM/yyyy"
                className="glass-date-input"
              />
            </div>

            <div className="modal-actions">
              <button onClick={() => setEditData(null)}>
                Cancel
              </button>
              <button
                className="save"
                onClick={handleUpdate}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CATEGORY POPUP ================= */}
      {showCategoryPopup && (
        <AddCategoryPopup
          onClose={() => setShowCategoryPopup(false)}
          onAdded={(newCat) => {
            if (categoryAddedCallback)
              categoryAddedCallback(newCat);

            setShowCategoryPopup(false); // ✅ close popup properly
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;