import { useEffect, useMemo, useRef, useState } from 'react';
import api from '../api';
import IncomeExpenseBar from '../components/charts/IncomeExpenseBar';
import IncomeExpenseLine from '../components/charts/IncomeExpenseLine';
import ExpensePie from '../components/charts/ExpensePie';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

export default function Report() {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [byMonth, setByMonth] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const barRef = useRef(null);
  const lineRef = useRef(null);
  const pieRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [s, m, a] = await Promise.all([
          api.get('/transactions/summary'),
          api.get('/transactions/by-month'),
          api.get('/transactions'),
        ]);
        setSummary(s.data || { income: 0, expense: 0, balance: 0 });
        setByMonth(m.data || []);
        setAll(a.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load data for report.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const generatePdf = async () => {
    try {
      setError(null);
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let y = 12;

      // Title
      doc.setFontSize(18);
      doc.text('Expense Report', pageWidth / 2, y, { align: 'center' });
      y += 8;

      // Summary
      doc.setFontSize(11);
      doc.text(`Total Income: BDT ${Number(summary.income || 0).toFixed(2)}`, 14, y);
      y += 5;
      doc.text(`Total Expense: BDT ${Number(summary.expense || 0).toFixed(2)}`, 14, y);
      y += 5;
      doc.text(`Balance: BDT ${Number(summary.balance || 0).toFixed(2)}`, 14, y);
      y += 8;

      // Capture charts as images (if present)
      const chartRefs = [barRef, lineRef, pieRef];
      for (const ref of chartRefs) {
        if (ref.current) {
          const canvas = await html2canvas(ref.current, { scale: 2 });
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = pageWidth - 28;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          if (y + imgHeight > pageHeight - 20) {
            doc.addPage();
            y = 12;
          }

          doc.addImage(imgData, 'PNG', 14, y, imgWidth, imgHeight);
          y += imgHeight + 6;
        }
      }

      // Transactions table (no action column)
      const body = all.map((t) => [
        formatDate(t.tx_date),
        (t.type || '').toString(),
        t.category || '',
        `BDT ${Number(t.amount || 0).toFixed(2)}`,
        t.description || '',
      ]);

      // If table won't fit on current page comfortably, push to new page
      if (y > pageHeight / 2) {
        doc.addPage();
        y = 12;
      }

      doc.autoTable({
        startY: y,
        head: [['Date', 'Type', 'Category', 'Amount', 'Description']],
        body,
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [22, 163, 74] },
        theme: 'striped',
        margin: { left: 10, right: 10 },
      });

      doc.save('expense-report.pdf');
    } catch (err) {
      console.error(err);
      setError('Failed to generate PDF.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-brand-700">Generate Report</h2>
          <p className="text-sm text-gray-500">
            This report includes key summary metrics, charts, and all transactions.
          </p>
        </div>
        <button
          type="button"
          onClick={generatePdf}
          className="btn-primary whitespace-nowrap"
          disabled={loading}
        >
          {loading ? 'Loading data...' : 'Download PDF'}
        </button>
      </div>

      {error && <div className="card text-sm text-red-600">{error}</div>}

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2" ref={barRef}>
          <IncomeExpenseBar data={formattedByMonth} />
        </div>
        <div ref={pieRef}>
          <ExpensePie data={expensePie} />
        </div>
        <div className="md:col-span-3" ref={lineRef}>
          <IncomeExpenseLine data={formattedByMonth} />
        </div>
      </div>
    </div>
  );
}
