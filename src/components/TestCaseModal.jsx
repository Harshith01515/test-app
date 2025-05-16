// src/components/TestCaseModal.jsx
import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import './TestCaseModal.css';

export default function TestCaseModal({ visible, initialCases, onSave, onCancel }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (initialCases && initialCases.length) {
      setRows(initialCases.map((r, i) => ({ ...r, id: i + 1 })));
    } else {
      setRows([{ id: 1, input: '', output: '' }]);
    }
  }, [initialCases]);

  const addRow = () => setRows(r => [...r, { id: r.length + 1, input: '', output: '' }]);
  const updateRow = (idx, field, value) =>
    setRows(r => r.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  const deleteRow = idx => setRows(r => r.filter((_, i) => i !== idx));

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Test Cases</h3>
        <p className="note">Note: For multiple values separate with <code>comma(,)</code></p>
        <button className="btn add-row" onClick={addRow}>+ ADD ROW</button>
        <div className="rows">
          {rows.map((row, idx) => (
            <div key={row.id} className="row">
              <input
                type="text"
                placeholder="Input"
                value={row.input}
                onChange={e => updateRow(idx, 'input', e.target.value)}
              />
              <input
                type="text"
                placeholder="Output"
                value={row.output}
                onChange={e => updateRow(idx, 'output', e.target.value)}
              />
              <button
                className="btn delete"
                onClick={() => deleteRow(idx)}
                aria-label="Delete row"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="actions">
          <button className="btn save" onClick={() => onSave(rows)}>SAVE</button>
          <button className="btn cancel" onClick={onCancel}>CANCEL</button>
        </div>
      </div>
    </div>
  );
}
