import { useEffect, useMemo, useState } from 'react';
import api from '../api';
import TransactionTable from '../components/TransactionTable';

export default function SearchTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/transactions');
      setTransactions(data || []);
    } catch (err) {
      setError('Failed to load transactions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const normalized = (value) =>
    (value || '').toString().toLowerCase();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return transactions;

    return transactions.filter((t) => {
      const dateStr = formatDate(t.tx_date);
      const type = normalized(t.type);
      const category = normalized(t.category);
      const amount = normalized(t.amount);
      const description = normalized(t.description);

      const haystack = [
        dateStr.toLowerCase(),
        type,
        category,
        amount,
        description,
      ].join(' ');

      return haystack.includes(q);
    });
  }, [transactions, query]);

  return (
    <div className="space-y-4">
      <div className="card max-w-5xl">
        <h2 className="text-xl font-semibold mb-2 text-brand-700">
          Search Transactions
        </h2>
        <p className="text-sm text-gray-500 mb-3">
          Search by date (Day/Month/Year), type, category, amount, or description.
        </p>
        <input
          className="input w-full"
          type="text"
          placeholder="Type to search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="mt-2 text-xs text-gray-500 flex justify-between">
          <span>
            {filtered.length} of {transactions.length} transaction
            {transactions.length === 1 ? '' : 's'} shown
          </span>
          {loading && <span>Loading...</span>}
        </div>
      </div>

      {loading && <div className="card">Loading transactions...</div>}
      {error && <div className="card text-red-600 text-sm">{error}</div>}

      {!loading && !error && (
        <TransactionTable items={filtered} reload={fetchAll} />
      )}
    </div>
  );
}
