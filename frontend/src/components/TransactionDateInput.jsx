import { useRef } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/TransactionDateInput.css";

function TransactionDateInput({ selected, onChange }) {
  const datePickerRef = useRef(null);

  return (
    <div className="transaction-date-wrapper">
      <DatePicker
        ref={datePickerRef}
        selected={selected}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        className="transaction-date-input"
        popperClassName="transaction-calendar"
        calendarClassName="transaction-calendar"
      />
      <button
        type="button"
        className="transaction-date-icon-btn"
        aria-label="Open calendar"
        onClick={() => datePickerRef.current?.setOpen(true)}
      >
        <FaCalendarAlt className="transaction-date-icon" />
      </button>
    </div>
  );
}

export default TransactionDateInput;
