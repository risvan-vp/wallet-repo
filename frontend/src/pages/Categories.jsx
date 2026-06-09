import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/Categories.css";

function Categories() {
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState(null);

  /* ================= LOAD ================= */
  const loadCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      setError("Failed to load categories");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* ================= ADD ================= */
  const addCategory = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setLoading(true);
      await API.post("/categories/add", { name, type });
      setName("");
      setError("");
      loadCategories();
    } catch (err) {
      setError("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await API.delete(`/categories/${id}`);
      loadCategories();
    } catch (err) {
      setError("Failed to delete category");
    }
  };

  /* ================= UPDATE ================= */
  const updateCategory = async () => {
    try {
      await API.put(`/categories/${editData._id}`, {
        name: editData.name,
        type: editData.type,
      });

      setEditData(null);
      loadCategories();
    } catch (err) {
      setError("Failed to update category");
    }
  };

  return (
    <div className="categories-page">
      <h2 className="page-title">Manage Categories</h2>

      {error && <div className="error-box">{error}</div>}

      {/* ================= ADD CARD ================= */}
      <div className="glass-card add-card">
        <h3>Add Category</h3>

        <form onSubmit={addCategory} className="add-form">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>
      </div>

      {/* ================= LIST CARD ================= */}
      <div className="glass-card list-card">
        <h3>All Categories</h3>

        {categories.length === 0 ? (
          <div className="empty-state">No categories found.</div>
        ) : (
          <ul className="category-list">
            {categories.map((c) => (
              <li key={c._id} className="category-item">
                <div className="left">
                  <span className="category-name">{c.name}</span>
                  <span
                    className={`badge ${
                      c.type === "income" ? "income" : "expense"
                    }`}
                  >
                    {c.type}
                  </span>
                </div>

                <div className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => setEditData(c)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteCategory(c._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
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
            <h3>Edit Category</h3>

            <input
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />

            <select
              value={editData.type}
              onChange={(e) =>
                setEditData({ ...editData, type: e.target.value })
              }
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <div className="modal-actions">
              <button onClick={() => setEditData(null)}>
                Cancel
              </button>
              <button className="save" onClick={updateCategory}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;