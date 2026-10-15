
import { useMemo, useState } from "react";
import "./App.css";

const menu = [
  { id: 1, name: "Classic Veg Burger", category: "Snacks", price: 120, image: "photo-1568901346375-23c9450c58cd" },
  { id: 2, name: "Margherita Pizza", category: "Snacks", price: 220, image: "photo-1513104890138-7c749659a591" },
  { id: 3, name: "French Fries", category: "Snacks", price: 90, image: "photo-1573080496219-bb080dd4f877" },
  { id: 4, name: "Grilled Sandwich", category: "Snacks", price: 130, image: "photo-1528735602780-2552fd46c7af" },
  { id: 5, name: "Veg Momos", category: "Snacks", price: 110, image: "photo-1563245372-f21724e3856d" },
  { id: 6, name: "Paneer Tikka", category: "Snacks", price: 190, image: "photo-1599487488170-d11ec9c172f0" },
  { id: 7, name: "Chicken Wings", category: "Snacks", price: 210, image: "photo-1527477396000-e27163b481c2" },
  { id: 8, name: "Crispy Samosa", category: "Snacks", price: 60, image: "photo-1601050690597-df0568f70950" },
  { id: 9, name: "Chicken Biryani", category: "Main Course", price: 240, image: "photo-1563379091339-03246963d96c" },
  { id: 10, name: "Veg Fried Rice", category: "Main Course", price: 160, image: "photo-1603133872878-684f208fb84b" },
  { id: 11, name: "Paneer Butter Masala", category: "Main Course", price: 210, image: "photo-1631452180519-c014fe946bc7" },
  { id: 12, name: "Butter Naan", category: "Main Course", price: 45, image: "photo-1603894584373-5ac82b2ae398" },
  { id: 13, name: "Masala Dosa", category: "Main Course", price: 100, image: "photo-1668236543090-82eba5ee5976" },
  { id: 14, name: "Chicken Curry", category: "Main Course", price: 230, image: "photo-1603894584373-5ac82b2ae398" },
  { id: 15, name: "Veg Biryani", category: "Main Course", price: 180, image: "photo-1589302168068-964664d93dc0" },
  { id: 16, name: "Dal Makhani", category: "Main Course", price: 170, image: "photo-1546833999-b9f581a1996d" },
  { id: 17, name: "Chocolate Cake", category: "Desserts", price: 100, image: "photo-1578985545062-69928b1d9587" },
  { id: 18, name: "Vanilla Ice Cream", category: "Desserts", price: 80, image: "photo-1560008581-09826d1de69e" },
  { id: 19, name: "Chocolate Brownie", category: "Desserts", price: 120, image: "photo-1606313564200-e75d5e30476c" },
  { id: 20, name: "Pancakes", category: "Desserts", price: 150, image: "photo-1528207776546-365bb710ee93" },
  { id: 21, name: "Cold Coffee", category: "Drinks", price: 100, image: "photo-1461023058943-07fcbe16d735" },
  { id: 22, name: "Fresh Lime Soda", category: "Drinks", price: 60, image: "photo-1513558161293-cdaf765edfd7" },
  { id: 23, name: "Orange Juice", category: "Drinks", price: 90, image: "photo-1613478223719-2ab802602423" },
  { id: 24, name: "Chocolate Milkshake", category: "Drinks", price: 130, image: "photo-1572490122747-3968b75cc699" },
];

const tables = Array.from({ length: 8 }, (_, i) => i + 1);
const categories = ["All", "Snacks", "Main Course", "Desserts", "Drinks"];

const imageUrl = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);

export default function App() {
  const [selectedTable, setSelectedTable] = useState(1);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState({});
  const [occupied, setOccupied] = useState({});
  const [message, setMessage] = useState("");

  const cart = orders[selectedTable] || [];

  const filteredMenu = useMemo(
    () =>
      menu.filter(
        (item) =>
          (category === "All" || item.category === category) &&
          item.name.toLowerCase().includes(search.toLowerCase())
      ),
    [category, search]
  );

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gst = subtotal * 0.05;
  const total = subtotal + gst;
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const occupiedCount = tables.filter((table) => occupied[table]).length;

  function updateCart(item, change) {
    setOrders((previous) => {
      const current = previous[selectedTable] || [];
      const existing = current.find((entry) => entry.id === item.id);
      let updated;

      if (existing) {
        updated = current
          .map((entry) =>
            entry.id === item.id
              ? { ...entry, qty: entry.qty + change }
              : entry
          )
          .filter((entry) => entry.qty > 0);
      } else if (change > 0) {
        updated = [...current, { ...item, qty: 1 }];
      } else {
        updated = current;
      }

      return { ...previous, [selectedTable]: updated };
    });
    setMessage("");
  }

  function placeOrder() {
    if (!cart.length) {
      setMessage("Please add items before placing an order.");
      return;
    }

    setOccupied((previous) => ({ ...previous, [selectedTable]: true }));
    setMessage(`Order placed successfully for Table ${selectedTable}.`);
  }

  function generateBill() {
    if (!cart.length) {
      setMessage("Add items before generating a bill.");
      return;
    }
    window.print();
  }

  function completePayment() {
    if (!cart.length) {
      setMessage("There is no bill to settle.");
      return;
    }

    if (!window.confirm(`Confirm payment of ${money(total)}?`)) return;

    setOrders((previous) => ({ ...previous, [selectedTable]: [] }));
    setOccupied((previous) => ({ ...previous, [selectedTable]: false }));
    setMessage(`Payment completed for Table ${selectedTable}.`);
  }

  function clearOrder() {
    if (!cart.length) {
      setMessage("This table has no items to clear.");
      return;
    }

    if (!window.confirm("Clear this order without payment?")) return;

    setOrders((previous) => ({ ...previous, [selectedTable]: [] }));
    setOccupied((previous) => ({ ...previous, [selectedTable]: false }));
    setMessage("Order cleared successfully.");
  }

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#">
          <span className="brand-icon">TB</span>
          <span>
            <strong>TableBite</strong>
            <small>Restaurant Management</small>
          </span>
        </a>
        <div className="live-status">
          <span className="status-dot" /> System Online
        </div>
      </header>

      <main className="dashboard">
        <section className="welcome">
          <div className="welcome-content">
            <span className="eyebrow">RESTAURANT DASHBOARD</span>
            <h1>Good food. Great moments.</h1>
            <p>Discover delicious dishes and manage your restaurant with ease.</p>
            <a className="explore-button" href="#food-menu">Explore Menu →</a>
          </div>
          <div className="welcome-image">
            <img
              src={imageUrl("photo-1414235077428-338989a2e8c0")}
              alt="Restaurant meal"
            />
          </div>
        </section>

        <section className="stats">
          <article className="stat-card">
            <span className="stat-icon purple">T</span>
            <div><p>Total Tables</p><h2>{tables.length}</h2></div>
          </article>
          <article className="stat-card">
            <span className="stat-icon orange">O</span>
            <div><p>Occupied Tables</p><h2>{occupiedCount}</h2></div>
          </article>
          <article className="stat-card">
            <span className="stat-icon green">A</span>
            <div><p>Available Tables</p><h2>{tables.length - occupiedCount}</h2></div>
          </article>
          <article className="stat-card">
            <span className="stat-icon pink">₹</span>
            <div><p>Current Bill</p><h2>{money(total)}</h2></div>
          </article>
        </section>

        <section className="panel table-section">
          <div className="section-heading">
            <div>
              <h2>Restaurant Tables</h2>
              <p>Select a table to manage its order.</p>
            </div>
            <span className="table-legend">● Available &nbsp; ● Occupied</span>
          </div>
          <div className="table-grid">
            {tables.map((table) => (
              <button
                key={table}
                className={`table-card ${selectedTable === table ? "selected" : ""} ${occupied[table] ? "occupied" : ""}`}
                onClick={() => {
                  setSelectedTable(table);
                  setMessage("");
                }}
              >
                <span className="table-symbol">T{table}</span>
                <strong>Table {table}</strong>
                <span className="table-status">
                  {occupied[table] ? "Occupied" : "Available"}
                </span>
              </button>
            ))}
          </div>
        </section>

        <div className="content-grid">
          <section className="panel menu-section" id="food-menu">
            <div className="section-heading">
              <div>
                <h2>Explore Our Menu</h2>
                <p>Find your favorites.</p>
              </div>
              <span className="count-badge">{filteredMenu.length} items</span>
            </div>

            <input
              className="search-input"
              type="search"
              placeholder="Search food items..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <div className="categories">
              {categories.map((item) => (
                <button
                  key={item}
                  className={category === item ? "category active" : "category"}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="food-grid">
              {filteredMenu.map((item) => (
                <article className="food-card" key={item.id}>
                  <div className="food-photo">
                    <img src={imageUrl(item.image)} alt={item.name} loading="lazy" />
                    <span className="food-category">{item.category}</span>
                  </div>
                  <div className="food-info">
                    <h3>{item.name}</h3>
                    <div className="food-bottom">
                      <strong>{money(item.price)}</strong>
                      <button
                        className="add-button"
                        onClick={() => updateCart(item, 1)}
                        aria-label={`Add ${item.name}`}
                      >+</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {!filteredMenu.length && (
              <p className="empty-state">No matching dishes found.</p>
            )}
          </section>

          <aside className="panel billing-section">
            <div className="section-heading">
              <div>
                <h2>Current Order</h2>
                <p>Table {selectedTable}</p>
              </div>
              <span className="count-badge">{itemCount} items</span>
            </div>

            <div className="cart-items">
              {!cart.length ? (
                <div className="empty-cart">
                  <div className="empty-cart-icon">+</div>
                  <h3>Your order starts here</h3>
                  <p>Add dishes from the menu to see them here.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <img src={imageUrl(item.image)} alt="" />
                    <div className="cart-food-info">
                      <h4>{item.name}</h4>
                      <p>{money(item.price)} each</p>
                      <strong>{money(item.price * item.qty)}</strong>
                    </div>
                    <div className="quantity">
                      <button onClick={() => updateCart(item, -1)} aria-label="Decrease quantity">−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateCart(item, 1)} aria-label="Increase quantity">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bill-details">
              <div><span>Subtotal</span><span>{money(subtotal)}</span></div>
              <div><span>GST (5%)</span><span>{money(gst)}</span></div>
              <div className="grand-total"><strong>Grand Total</strong><strong>{money(total)}</strong></div>
            </div>

            <button className="primary-button" onClick={placeOrder}>Place Order</button>
            <button className="secondary-button" onClick={generateBill}>Generate & Print Bill</button>
            <button className="pay-button" onClick={completePayment}>Complete Payment</button>
            <button className="clear-button" onClick={clearOrder}>Clear Order</button>

            {message && <p className="feedback" role="status">{message}</p>}

            <p className="billing-note">
              GST is set to 5% for this demo. Verify the applicable tax rate
              before using this for real transactions.
            </p>
          </aside>
        </div>

        <footer className="footer">
          <span>TableBite © 2026</span>
          <span>Smart Ordering · Simple Billing · Better Service</span>
        </footer>
      </main>
    </div>
  );
}
