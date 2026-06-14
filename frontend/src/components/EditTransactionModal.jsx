import TransactionDateInput from "./TransactionDateInput";

function EditTransactionModal({ editData, setEditData, onClose, onSave }) {
  if (!editData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
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

        <TransactionDateInput
          selected={editData.date}
          onChange={(date) => setEditData({ ...editData, date })}
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="save" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditTransactionModal;
