import { useEffect, useState } from "react";
import AddTransaction from "../components/AddTransaction";
import AddCategoryPopup from "../components/AddCategoryPopup";
import EditTransactionModal from "../components/EditTransactionModal";
import LatestTransactions from "../components/LatestTransactions";
import API from "../services/api";
import "../styles/Dashboard.css";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [editData, setEditData] = useState(null);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [highlightedTx, setHighlightedTx] = useState(null);
  const [categoryAddedCallback, setCategoryAddedCallback] = useState(null);

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
    let isMounted = true;

    const fetchTransactions = async () => {
      try {
        const res = await API.get("/transactions");
        const sorted = Array.isArray(res.data)
          ? res.data.sort((a, b) => new Date(b.date) - new Date(a.date))
          : [];

        if (isMounted) setTransactions(sorted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTransactions();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    await API.delete(`/transactions/${id}`);
    loadTransactions();
  };

  const openEdit = (t) =>
    setEditData({
      ...t,
      date: new Date(t.date),
    });

  const handleUpdate = async () => {
    await API.put(`/transactions/${editData._id}`, {
      ...editData,
      amount: Number(editData.amount),
    });

    setEditData(null);
    loadTransactions();
  };

  const handleTransactionAdded = (newTx) => {
    if (!newTx) {
      loadTransactions();
      return;
    }

    setTransactions((prev) => [newTx, ...prev]);
    setHighlightedTx(newTx._id);
    setTimeout(() => setHighlightedTx(null), 2000);
  };

  const openCategoryPopup = (callback) => {
    setShowCategoryPopup(true);
    setCategoryAddedCallback(() => callback);
  };

  const handleCategoryAdded = (newCat) => {
    if (categoryAddedCallback) categoryAddedCallback(newCat);
    setShowCategoryPopup(false);
  };

  return (
    <div className="dashboard-root">
      <h2 className="dashboard-title">Dashboard</h2>

      <AddTransaction
        refresh={handleTransactionAdded}
        openCategory={openCategoryPopup}
      />

      <LatestTransactions
        transactions={transactions}
        highlightedTx={highlightedTx}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <EditTransactionModal
        editData={editData}
        setEditData={setEditData}
        onClose={() => setEditData(null)}
        onSave={handleUpdate}
      />

      {showCategoryPopup && (
        <AddCategoryPopup
          onClose={() => setShowCategoryPopup(false)}
          onAdded={handleCategoryAdded}
        />
      )}
    </div>
  );
}

export default Dashboard;
