const { useState, useEffect, useMemo } = React;

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Entertainment', 'Healthcare', 'Shopping', 'Salary', 'Freelance', 'Other'];
const CATEGORY_ICONS = { Food:'🍔', Transport:'🚗', Housing:'🏠', Entertainment:'🎬', Healthcare:'💊', Shopping:'🛍️', Salary:'💼', Freelance:'💻', Other:'📦' };

const SAMPLE_TRANSACTIONS = [
  { id: 1, description: 'Monthly Salary', amount: 3500, type: 'income', category: 'Salary', date: '2024-06-01' },
  { id: 2, description: 'Rent Payment', amount: 1200, type: 'expense', category: 'Housing', date: '2024-06-02' },
  { id: 3, description: 'Grocery Shopping', amount: 85.50, type: 'expense', category: 'Food', date: '2024-06-05' },
  { id: 4, description: 'Freelance Project', amount: 750, type: 'income', category: 'Freelance', date: '2024-06-08' },
  { id: 5, description: 'Netflix Subscription', amount: 15.99, type: 'expense', category: 'Entertainment', date: '2024-06-10' },
  { id: 6, description: 'Gas Fill-up', amount: 60, type: 'expense', category: 'Transport', date: '2024-06-12' },
  { id: 7, description: 'Doctor Visit', amount: 120, type: 'expense', category: 'Healthcare', date: '2024-06-15' },
  { id: 8, description: 'Online Course', amount: 49.99, type: 'expense', category: 'Entertainment', date: '2024-06-18' },
];

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : SAMPLE_TRANSACTIONS;
  });
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMonth, setFilterMonth] = useState('');

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(transactions));
  },[transactions]); 

  const filtered = useMemo(() => {
    return transactions
      .filter(t => filterType === 'all' || t.type === filterType)
      .filter(t => filterCategory === 'all' || t.category === filterCategory)
      .filter(t => !filterMonth || t.date.startsWith(filterMonth))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, filterType, filterCategory, filterMonth]);

  const totalIncome = transactions.reduce((sum, t) =>
    t.type === 'income' ? sum + t.amount : sum, 0); 

  const totalExpenses = transactions.reduce((sum, t) =>
    t.type === 'expense' ? sum + t.amount : sum, 0);

  const balance = totalIncome - totalExpenses;

  function addTransaction(tx) {
    setTransactions(prev => [tx, ...prev]);
  }

  function deleteTransaction(id) {
    // const idx = transactions.findIndex(t => t.id === id);
    // transactions.splice(idx, 1);
    // setTransactions([...transactions]);
    setTransactions(prev=>prev.filter(t.id===id))
  }

  const categoryTotals = useMemo(() => {
    const totals = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
    return totals;
  }, [transactions]);

  return (
    <div className="app">
      <div className="app-header"><h1>💰 Expense Tracker</h1></div>

      <div className="balance-card">
        <h2>Current Balance</h2>
        <div className="amount">${balance.toFixed(2)}</div>
        <div className="balance-stats">
          <div>
            <label>Total Income</label>
            <span className="income-stat">+${totalIncome.toFixed(2)}</span>
          </div>
          <div>
            <label>Total Expenses</label>
            <span className="expense-stat">-${totalExpenses.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <AddTransactionForm onAdd={addTransaction} />

      <div className="panel">
        <h3>Transactions</h3>
        <div className="filters">
          <select value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} />
        </div>
        <div className="tx-list">
          {filtered.length === 0 && <div className="empty-msg">No transactions found.</div>}
          {filtered.map(tx => (
            <div key={tx.id} className={`tx-item ${tx.type}`}>
              <div className="tx-icon">{CATEGORY_ICONS[tx.category] || '📦'}</div>
              <div className="tx-info">
                <div className="tx-desc">{tx.description}</div>
                <div className="tx-meta">{tx.category} · {tx.date}</div>
              </div>
              <div className={`tx-amount ${tx.type}`}>
                {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
              </div>
              <button className="delete-tx" onClick={() => deleteTransaction(tx.id)}>×</button>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h3>Spending by Category</h3>
        <div className="category-summary">
          {Object.entries(categoryTotals).map(([cat, amt]) => (
            <div key={cat} className="cat-card">
              <div className="cat-name">{CATEGORY_ICONS[cat]} {cat}</div>
              <div className="cat-amount">${amt.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddTransactionForm({ onAdd }) {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!desc.trim()) errs.desc = 'Description required.';
    if (!amount || Number(amount)) errs.amount = 'Amount must required greater than 0';
    if (isNaN(Number(amount))) errs.amount = 'Must be a number.';
    if (!date) errs.date = 'Date required.';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    onAdd({
      id: Date.now(),
      description: desc.trim(),
      amount: parseFloat(amount),
      type,
      category,
      date,
    });

    setDesc(''); setAmount(''); setDate(''); setType('expense'); setCategory('Food');
    setErrors({});
  }

  return (
    <div className="panel">
      <h3>Add Transaction</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group full">
            <label>Description</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. Grocery shopping" />
            {errors.desc && <span className="err">{errors.desc}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Amount ($)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" step="0.01" min="0" />
            {errors.amount && <span className="err">{errors.amount}</span>}
          </div>
          <div className="form-group">
            <label>Type</label>
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            {errors.date && <span className="err">{errors.date}</span>}
          </div>
        </div>
        <button className="btn btn-primary" type="submit">Add Transaction</button>
      </form>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
