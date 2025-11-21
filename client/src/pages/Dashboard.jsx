import { useEffect, useMemo, useState } from 'react';
import api from '../api';
import SummaryCard from '../components/SummaryCard';
import TransactionTable from '../components/TransactionTable';
import IncomeExpenseBar from '../components/charts/IncomeExpenseBar';
import IncomeExpenseLine from '../components/charts/IncomeExpenseLine';
import ExpensePie from '../components/charts/ExpensePie';

export default function Dashboard() {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [recent, setRecent] = useState([]);
  const [byMonth, setByMonth] = useState([]);
  const [all, setAll] = useState([]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const s = await api.get('/transactions/summary');
  //       setSummary(s.data);

  //       const r = await api.get('/transactions/recent?limit=5');
  //       setRecent(r.data);

  //       const m = await api.get('/transactions/by-month');
  //       setByMonth(m.data);

  //       const a = await api.get('/transactions');
  //       setAll(a.data);
  //     } catch (err) {
  //       console.error("Error fetching dashboard data:", err);
  //     }
  //   })();
  // }, []);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);


  // const fetchRecentTransactions = async () => {
  //   try {
  //     const r = await api.get('/transactions/recent?limit=5');
  //     setRecent(r.data);
  //   } catch (err) {
  //     console.error("Failed to fetch recent transactions:", err);
  //   }
  // };

  const fetchDashboardData = async () => {
    try {
      const [s, r, m, a] = await Promise.all([
        api.get('/transactions/summary'),
        api.get('/transactions/recent?limit=5'),
        api.get('/transactions/by-month'),
        api.get('/transactions'),
      ]);

      setSummary(s.data);
      setRecent(r.data);
      setByMonth(m.data);
      setAll(a.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };


  const expensePie = useMemo(() => {
    const map = {};
    all
      .filter((x) => x.type === 'expense')
      .forEach((x) => {
        map[x.category] = (map[x.category] || 0) + Number(x.amount);
      });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [all]);

  const formattedByMonth = useMemo(() => {
    return byMonth.map((item) => {
      const monthField = item.month || item.date || item.ym;

      if (!monthField) return { ...item, ym: 'Unknown' };

      const dateStr = monthField.length === 7 ? `${monthField}-01` : monthField;
      const date = new Date(dateStr);

      if (isNaN(date)) return { ...item, ym: 'Invalid' };

      const monthYear = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      return { ...item, ym: monthYear };
    });
  }, [byMonth]);

  return (
    <div className="grid md:grid-cols-3 gap-5">

      <SummaryCard title="Total Balance" value={`BDT ${summary.balance.toFixed(0)}`} />
      <SummaryCard title="Total Income" value={`BDT ${summary.income.toFixed(0)}`} />
      <SummaryCard title="Total Expenses" value={`BDT ${summary.expense.toFixed(0)}`} />

      <div className="md:col-span-2">
        <IncomeExpenseBar data={formattedByMonth} />
      </div>

      <ExpensePie data={expensePie} />

      <div className="md:col-span-3 mt-5 flex justify-center">
        <div className="w-full max-w-5xl">
          <IncomeExpenseLine data={formattedByMonth} />
        </div>
      </div>

      <div className="md:col-span-3">
        <h3 className="font-semibold mb-2">Recent Transactions</h3>
        <TransactionTable items={recent} reload={fetchDashboardData} />
      </div>
    </div>
  );
}
