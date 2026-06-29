const { useState, useEffect, useCallback } = React;

const MOCK_USERS = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: [
    "Alice Johnson",
    "Bob Smith",
    "Carol White",
    "David Brown",
    "Eva Martinez",
    "Frank Lee",
    "Grace Kim",
    "Henry Wilson",
    "Iris Chen",
    "Jack Taylor",
    "Karen Moore",
    "Liam Davis",
    "Mia Garcia",
    "Noah Anderson",
    "Olivia Thomas",
    "Paul Jackson",
    "Quinn Harris",
    "Rose Martin",
    "Sam Lewis",
    "Tina Walker",
    "Uma Hall",
    "Victor Young",
    "Wendy King",
  ][i],
  email: `user${i + 1}@example.com`,
  role: [
    "Admin",
    "Editor",
    "Viewer",
    "Editor",
    "Viewer",
    "Admin",
    "Viewer",
    "Editor",
    "Viewer",
    "Admin",
    "Viewer",
    "Editor",
    "Viewer",
    "Admin",
    "Editor",
    "Viewer",
    "Editor",
    "Viewer",
    "Admin",
    "Viewer",
    "Editor",
    "Viewer",
    "Admin",
  ][i],
  status: i % 3 === 0 ? "inactive" : i % 5 === 0 ? "pending" : "active",
  joinDate: `2023-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
  revenue: Math.floor(Math.random() * 10000) + 500,
}));

function StatCard({ title, value, change, up }) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <div className="value">{value}</div>
      <div className={`change ${up ? "up" : "down"}`}>
        {up ? "▲" : "▼"} {change}
      </div>
    </div>
  );
}

function UserTable({ users }) {
  const [sortField, setSortField] = React.useState("name");
  const [sortDir, setSortDir] = React.useState("asc");

  function handleSort(field) {
    if (field === sortField) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  function sortUsers(arr) {
    return arr.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === "string") {
        return sortDir === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortDir === "asc" ? valA - valB : valB - valA;
    });
  }

  const sorted = sortUsers(users);

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
            Name {sortField === "name" ? (sortDir === "asc" ? "▲" : "▼") : ""}
          </th>
          <th>Email</th>
          <th onClick={() => handleSort("role")} style={{ cursor: "pointer" }}>
            Role
          </th>
          <th>Status</th>
          <th
            onClick={() => handleSort("revenue")}
            style={{ cursor: "pointer" }}
          >
            Revenue
          </th>
          <th>Join Date</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((user, index) => (
          <tr key={index}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <span
                /* className={`badge ${user.status === "active" ? "inactive" : user.status === "inactive" ? "active" : "pending"}`} */
                className={`badge ${user.status}`}
              >
                {user.status}
              </span>
            </td>
            <td>${user.revenue.toLocaleString()}</td>
            <td>{user.joinDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Dashboard() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const PAGE_SIZE = 5;

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        setUsers(MOCK_USERS);
        setLoading(false);
      } catch (e) {
        setError("Failed to load users");
        setLoading(false);
      }
    }, 800);
  },[]);//!
  const totalRevenue = users.reduce((s, u) => s + u.revenue, 0);
  const activeUsers = users.filter((u) => u.status === "active").length;
  const avgRevenue = users.length>0?totalRevenue / users.length:0; //!

  const filtered = users.filter((user) => {
    const matchesSearch =
      search === "" ||
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.includes(search);//!
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function handleSearchChange(e) {
    setSearch(e.target.value);
    setCurrentPage(1)//!
  }

  function handleStatusChange(e) {
    setStatusFilter(e.target.value);
  }

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Dashboard</h2>
        <nav>
          <a className="active">Users</a>
          <a>Analytics</a>
          <a>Settings</a>
        </nav>
      </div>
      <div className="main">
        <h1>User Management</h1>
        <div className="stats-grid">
          <StatCard
            title="Total Users"
            value={users.length}
            change="12% this month"
            up={true}
          />
          <StatCard
            title="Active Users"
            value={activeUsers}
            change="3% this week"
            up={true}
          />
          <StatCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            change="8% this month"
            up={true}
          />
          <StatCard
            title="Avg Revenue"
            value={`$${avgRevenue.toFixed(0)}`}
            change="2% this week"
            up={false}
          />
        </div>

        <div className="section">
          <h2>All Users ({filtered.length})</h2>
          <div className="search-bar">
            <input
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearchChange}
            />
            <select value={statusFilter} onChange={handleStatusChange}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          {paginated.length === 0 ? (
            <p
              style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}
            >
              No users found.
            </p>
          ) : (
            <UserTable users={paginated} />
          )}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Dashboard />);
