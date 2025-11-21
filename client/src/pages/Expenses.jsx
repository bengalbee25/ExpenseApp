import { useEffect, useState } from 'react';
import api from '../api';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';

export default function Expenses() {
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data } = await api.get('/transactions?type=expense');
    setItems(data);
  };

  useEffect(() => { load(); }, []);

  const add = async (tx) => {
    await api.post('/transactions', tx);
    await load();
  };

  return (
    <div className="grid gap-5">
      <TransactionForm onSubmit={add} type="expense" />
      <TransactionTable items={items} reload={load} />
    </div>
  );
}
