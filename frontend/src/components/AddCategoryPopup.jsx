import { useState } from "react";
import API from "../services/api";
import "../styles/AddCategoryPopup.css";

function AddCategoryPopup({ onClose, onAdded }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      const res = await API.post("/categories/add", { name, type });
      if (res.data) onAdded(res.data);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h3>New Category</h3>
        <form onSubmit={submit}>
          <input
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <div className="popup-actions">
            <button type="button" className="cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="save" disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCategoryPopup;