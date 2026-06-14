function LatestTransactions({
  transactions,
  highlightedTx,
  onEdit,
  onDelete,
}) {
  const formatDisplayDate = (date) =>
    new Date(date).toLocaleDateString("en-GB");

  return (
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
              <div className="date">{formatDisplayDate(t.date)}</div>
            </div>

            <div className="right-section">
              <span
                className={
                  t.type === "expense" ? "amount expense" : "amount income"
                }
              >
                {t.type === "expense" ? "-" : "+"}₹{t.amount}
              </span>

              <button className="icon-btn edit" onClick={() => onEdit(t)}>
                ✏️
              </button>

              <button
                className="icon-btn delete"
                onClick={() => onDelete(t._id)}
              >
                🗑
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LatestTransactions;
