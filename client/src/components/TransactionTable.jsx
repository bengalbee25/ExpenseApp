import { useState } from 'react';
import api from '../api';

export default function TransactionTable({ items, reload }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const startEdit = (t) => {
    setEditing(t.id);
    setForm({ ...t });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      const payload = {
        ...form,
        tx_date: form.tx_date ? form.tx_date.split('T')[0] : null,
        amount: Number(form.amount),
      };
      await api.put(`/transactions/${editing}`, payload);
      setEditing(null);
      if (reload) reload();
    } catch (err) {
      console.error('Save error:', err.response?.data || err);
      alert('Failed to save changes.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      if (reload) reload();
    } catch (err) {
      console.error('Delete error:', err.response?.data || err);
      alert('Failed to delete transaction.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="card overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500">
            <th className="py-2">Date</th>
            <th className="py-2">Type</th>
            <th className="py-2">Category</th>
            <th className="py-2">Amount</th>
            <th className="py-2">Description</th>
            <th className="py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr key={t.id} className="border-t text-sm">
              {editing === t.id ? (
                <>
                  <td className="py-2">
                    <input
                      className="input"
                      type="date"
                      name="tx_date"
                      value={
                        form.tx_date
                          ? (() => {
                              const d = new Date(form.tx_date);
                              const year = d.getFullYear();
                              const month = String(d.getMonth() + 1).padStart(2, '0');
                              const day = String(d.getDate()).padStart(2, '0');
                              return `${year}-${month}-${day}`;
                            })()
                          : ''
                      }
                      onChange={handleChange}
                    />
                  </td>
                  <td className="py-2">
                    <select
                      className="input w-full min-w-[120px] px-2 py-1 text-sm"
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </td>
                  <td className="py-2">
                    <input
                      className="input"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      className="input"
                      name="amount"
                      type="number"
                      value={form.amount}
                      onChange={handleChange}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      className="input"
                      name="description"
                      value={form.description || ''}
                      onChange={handleChange}
                    />
                  </td>
                  <td className="py-2 text-right space-x-2">
                    <button
                      onClick={saveEdit}
                      className="min-w-[65px] px-3 py-1 text-xs rounded-md font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-gray-500 text-xs"
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="py-2">{formatDate(t.tx_date)}</td>
                  <td className="py-2 capitalize">{t.type}</td>
                  <td className="py-2">{t.category}</td>
                  <td className="py-2 font-medium">
                    BDT {Number(t.amount).toFixed(0)}
                  </td>
                  <td className="py-2">{t.description || '-'}</td>
                  <td className="py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(t)}
                        className="min-w-[65px] px-3 py-1 text-xs rounded-md font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="min-w-[65px] px-3 py-1 text-xs rounded-md font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
