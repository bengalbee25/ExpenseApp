import { useState } from 'react';

export default function TransactionForm({ onSubmit, type }) {
  const [form, setForm] = useState({ amount: '', category: '', tx_date: '', description: '' });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, type, amount: Number(form.amount) });
    setForm({ amount: '', category: '', tx_date: '', description: '' });
  };

  return (
    <form onSubmit={submit} className="card grid md:grid-cols-5 gap-3">
      <input className="input" name="amount" type="number" step="1" min="0" placeholder="Amount" value={form.amount} onChange={handle} required />
      <input className="input" name="category" placeholder="Category" value={form.category} onChange={handle} required />
      <input className="input" name="tx_date" type="date" value={form.tx_date} onChange={handle} required />
      <input className="input md:col-span-2" name="description" placeholder="Description (optional)" value={form.description} onChange={handle} />
      <button className="btn-primary md:col-span-5">Add {type === 'income' ? 'Income' : 'Expense'}</button>
    </form>
  );
}
