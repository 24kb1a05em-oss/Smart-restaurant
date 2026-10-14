
import { useMemo, useState } from "react";
import "./App.css";

const menu = [
  { id: 1, name: "Veg Burger", category: "Snacks", price: 120, emoji: "🍔" },
  { id: 2, name: "Margherita Pizza", category: "Snacks", price: 220, emoji: "🍕" },
  { id: 3, name: "French Fries", category: "Snacks", price: 90, emoji: "🍟" },
  { id: 4, name: "Chicken Biryani", category: "Main Course", price: 240, emoji: "🍛" },
  { id: 5, name: "Veg Fried Rice", category: "Main Course", price: 160, emoji: "🍚" },
  { id: 6, name: "Paneer Butter Masala", category: "Main Course", price: 210, emoji: "🥘" },
  { id: 7, name: "Chocolate Cake", category: "Desserts", price: 100, emoji: "🍰" },
  { id: 8, name: "Ice Cream", category: "Desserts", price: 80, emoji: "🍨" },
  { id: 9, name: "Cold Coffee", category: "Drinks", price: 100, emoji: "🥤" },
  { id: 10, name: "Fresh Lime Soda", category: "Drinks", price: 60, emoji: "🍋" },
];

const tableList = Array.from({ length: 8 }, (_, i) => i + 1);
const categories = ["All", "Snacks", "Main Course", "Desserts", "Drinks"];

function money(amount) {
  return `₹${amount.toFixed(2)}`;
}

export default function App() {
  const [selectedTable, setSelectedTable] = useState(1);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState({});
  const [occupied, setOccupied] = useState({});
  const [message, setMessage] = useState("");

  const cart = orders[selectedTable] || [];

  const filteredMenu = menu.filter((item) => {
    const matchesCategory =
      category === "All" || item.category === category;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const gst = subtotal * 0.05;
  const total = subtotal + gst;
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

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
    if (cart.length === 0) {
      setMessage("Please add food items before placing an order.");
      return;
    }

    setOccupied((previous) => ({
      ...previous,
      [selectedTable]: true,
    }));

    setMessage(`Order placed successfully for Table ${selectedTable}!`);
  }

  function generateBill() {
    if (cart.length === 0) {
      setMessage("Add items before generating a bill.");
      return;
    }

    window.print();
  }

  function completePayment() {
    if (cart.length === 0) {
      setMessage("There is no bill to settle.");
      return;
    }

    const confirmed = window.confirm(
      `Confirm payment of ${money(total)} for Table ${selectedTable}?`
    );

    if (!confirmed) return;

    setOrders((previous) => ({
      ...previous,
      [selectedTable]: [],
    }));

    setOccupied((previous) => ({
      ...previous,
      [selectedTable]: false,
    }));

    setMessage(`Payment completed for Table ${selectedTable}.`);
  }

  function clearTable() {
    if (cart.length === 0) {
      setMessage("This table has no items to clear.");
      return;
    }

    const confirmed = window.confirm(
      "Clear this order without completing payment?"
    );

    if (!confirmed) return;

    setOrders((previous) => ({
      ...previous,
      [selectedTable]: [],
    }));

    setOccupied((previous) => ({
      ...previous,
      [selectedTable]: false,
    }));

    setMessage("Order cleared.");
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">🍽️</div>
          <div>
            <h1>TableBite</h1>
            <p>Smart Restaurant Management</p>
          </div>
        </div>
        <div className="live-status">
          <span className="status-dot"></span>
          System Online
        </div>
      </header>

      <main className="dashboard">
        <section className="welcome">
          <div>
            <p className="eyebrow">RESTAURANT DASHBOARD</p>
            <h2>Good food, smart service.</h2>
            <p className="welcome-text">
              Select a table, take an order, and generate the bill.
            </p>
          </div>
          <div className="welcome-emoji">🍴</div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <span className="stat-icon purple">▦</span>
            <div>
              <p>Total Tables</p>
              <h3>{tableList.length}</h3>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon orange">●</span>
            <div>
              <p>Occupied Tables</p>
              <h3>
                {tableList.filter((t) => occupied[t]).length}
              </h3>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon green">✓</span>
            <div>
              <p>Available Tables</p>
              <h3>
                {tableList.filter((t) => !occupied[t]).length}
              </h3>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon pink">₹</span>
            <div>
              <p>Current Bill</p>
              <h3>{money(total)}</h3>
            </div>
          </div>
        </section>

        <section className="table-section panel">
          <div className="section-heading">
            <div>
              <h2>Restaurant Tables</h2>
              <p>Select a table to manage its order.</p>
            </div>
            <div className="legend">
              <span><i className="available-dot"></i> Available</span>
              <span><i className="occupied-dot"></i> Occupied</span>
            </div>
          </div>

          <div className="table-grid">
            {tableList.map((table) => (
              <button
                key={table}
                className={`table-card ${
                  selectedTable === table ? "selected" : ""
                } ${occupied[table] ? "occupied" : ""}`}
                onClick={() => {
                  setSelectedTable(table);
                  setMessage("");
                }}
              >
                <span className="table-symbol">▦</span>
                <strong>Table {table}</strong>
                <span className="table-status">
                  {occupied[table] ? "Occupied" : "Available"}
                </span>
                {selectedTable === table && (
                  <span className="selected-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </section>

        <div className="content-grid">
          <section className="menu-section panel">
            <div className="section-heading">
              <div>
                <h2>Food Menu</h2>
                <p>Choose your favorite dishes.</p>
              </div>
              <span className="count-badge">{filteredMenu.length} items</span>
            </div>

            <input
              className="search-input"
              type="search"
              placeholder="🔍  Search food items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                  <div className="food-emoji">{item.emoji}</div>
                  <span className="food-category">{item.category}</span>
                  <h3>{item.name}</h3>
                  <div className="food-bottom">
                    <strong>{money(item.price)}</strong>
                    <button
                      className="add-button"
                      onClick={() => updateCart(item, 1)}
                      aria-label={`Add ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {filteredMenu.length === 0 && (
              <p className="empty-state">No matching food items found.</p>
            )}
          </section>

          <aside className="billing-section panel">
            <div className="section-heading">
              <div>
                <h2>Current Order</h2>
                <p>Table {selectedTable}</p>
              </div>
              <span className="cart-icon">🛒</span>
            </div>

            <div className="cart-summary">
              <span>Items in order</span>
              <strong>{itemCount}</strong>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <span>🛍️</span>
                  <h3>Your cart is empty</h3>
                  <p>Add dishes from the menu to get started.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-food-icon">{item.emoji}</div>
                    <div className="cart-food-info">
                      <h4>{item.name}</h4>
                      <p>{money(item.price)} each</p>
                      <strong>{money(item.price * item.qty)}</strong>
                    </div>
                    <div className="quantity">
                      <button onClick={() => updateCart(item, -1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateCart(item, 1)}>+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bill-details">
              <div>
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <div>
                <span>GST (5%)</span>
                <span>{money(gst)}</span>
              </div>
              <div className="grand-total">
                <strong>Grand Total</strong>
                <strong>{money(total)}</strong>
              </div>
            </div>

            <button className="primary-button" onClick={placeOrder}>
              ✓ Place Order
            </button>
            <button className="secondary-button" onClick={generateBill}>
              ▤ Generate & Print Bill
            </button>
            <button className="pay-button" onClick={completePayment}>
              ₹ Complete Payment
            </button>
            <button className="clear-button" onClick={clearTable}>
              Clear Order
            </button>

            {message && (
              <p className="feedback" role="status">{message}</p>
            )}

            <p className="billing-note">
              GST is calculated at 5% for this demo. Update the rate to match
              your restaurant's applicable tax rules.
            </p>
          </aside>
        </div>

        <footer>
          <span>TableBite © 2026</span>
          <span>Smart Ordering • Simple Billing • Better Service</span>
        </footer>
      </main>
    </div>
  );
}
