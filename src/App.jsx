
import React, { useMemo, useState } from "react";
import "./App.css";

const menu = [
  { id: 1, name: "Classic Veg Burger", category: "Starters", price: 120, image: "photo-1568901346375-23c9450c58cd", tag: "Bestseller" },
  { id: 2, name: "Margherita Pizza", category: "Starters", price: 220, image: "photo-1513104890138-7c749659a591", tag: "Popular" },
  { id: 3, name: "French Fries", category: "Starters", price: 90, image: "photo-1573080496219-bb080dd4f877" },
  { id: 4, name: "Grilled Sandwich", category: "Starters", price: 130, image: "photo-1528735602780-2552fd46c7af" },
  { id: 5, name: "Veg Momos", category: "Starters", price: 110, image: "photo-1563245372-f21724e3856d" },
  { id: 6, name: "Paneer Tikka", category: "Starters", price: 190, image: "photo-1599487488170-d11ec9c172f0", tag: "Chef's pick" },
  { id: 7, name: "Chicken Wings", category: "Starters", price: 210, image: "photo-1527477396000-e27163b481c2" },
  { id: 8, name: "Crispy Samosa", category: "Starters", price: 60, image: "photo-1601050690597-df0568f70950" },
  { id: 9, name: "Chicken Biryani", category: "Main Course", price: 240, image: "photo-1589302168068-964664d93dc0", tag: "Bestseller" },
  { id: 10, name: "Veg Fried Rice", category: "Main Course", price: 160, image: "photo-1603133872878-684f208fb84b" },
  { id: 11, name: "Paneer Butter Masala", category: "Main Course", price: 210, image: "photo-1631452180519-c014fe946bc7" },
  { id: 12, name: "Butter Naan", category: "Main Course", price: 45, image: "photo-1603894584373-5ac82b2ae398" },
  { id: 13, name: "Masala Dosa", category: "Main Course", price: 100, image: "photo-1668236543090-82eba5ee5976" },
  { id: 14, name: "Chicken Curry", category: "Main Course", price: 230, image: "photo-1585937421612-70a008356fbe" },
  { id: 15, name: "Veg Biryani", category: "Main Course", price: 180, image: "photo-1589302168068-964664d93dc0" },
  { id: 16, name: "Dal Makhani", category: "Main Course", price: 170, image: "photo-1546833999-b9f581a1996d" },
  { id: 17, name: "Chicken 65", category: "Main Course", price: 220, image: "photo-1603894584373-5ac82b2ae398", tag: "Spicy" },
  { id: 18, name: "Hyderabadi Dum Biryani", category: "Main Course", price: 280, image: "photo-1633945274405-b6c8069047b0", tag: "Bestseller" },
  { id: 19, name: "Mushroom Fried Rice", category: "Main Course", price: 175, image: "photo-1512058564366-18510be2db19" },
  { id: 20, name: "Tandoori Chicken", category: "Main Course", price: 290, image: "photo-1599487488170-d11ec9c172f0" },
  { id: 21, name: "Chocolate Cake", category: "Desserts", price: 100, image: "photo-1578985545062-69928b1d9587" },
  { id: 22, name: "Vanilla Ice Cream", category: "Desserts", price: 80, image: "photo-1560008581-09826d1de69e" },
  { id: 23, name: "Chocolate Brownie", category: "Desserts", price: 120, image: "photo-1606313564200-e75d5e30476c" },
  { id: 24, name: "Cheesecake", category: "Desserts", price: 160, image: "photo-1533134242443-d4fd215305ad" },
  { id: 25, name: "Cold Coffee", category: "Drinks", price: 100, image: "photo-1461023058943-07fcbe16d735" },
  { id: 26, name: "Fresh Lime Soda", category: "Drinks", price: 60, image: "photo-1544145945-f90425340c7e", tag: "Refreshing" },
  { id: 27, name: "Orange Juice", category: "Drinks", price: 90, image: "photo-1613478223719-2ab802602423" },
  { id: 28, name: "Chocolate Milkshake", category: "Drinks", price: 130, image: "photo-1572490122747-3968b75cc699" },
  { id: 29, name: "Mango Smoothie", category: "Drinks", price: 140, image: "photo-1505252585461-04db1eb84625" },
  { id: 30, name: "Iced Lemon Tea", category: "Drinks", price: 75, image: "photo-1556679343-c7306c1976bc" },
];

const categories = ["All", "Starters", "Main Course", "Desserts", "Drinks"];
const tables = Array.from({ length: 8 }, (_, i) => i + 1);
const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);

const imageUrl = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=85`;

function FoodImage({ item, className = "" }) {
  const [attempt, setAttempt] = useState(0);

  const fallbacks = {
    "Chicken Biryani": [
      "photo-1633945274405-b6c8069047b0",
      "photo-1589302168068-964664d93dc0",
    ],
    "Fresh Lime Soda": [
      "photo-1513558161293-cdaf765edfd7",
      "photo-1544145945-f90425340c7e",
    ],
  };

  const choices = [item.image, ...(fallbacks[item.name] || [])];
  const src =
    attempt < choices.length
      ? imageUrl(choices[attempt])
      : `https://placehold.co/700x450/f4f0e8/6f563e?text=${encodeURIComponent(item.name)}`;

  return (
    <img
      className={className}
      src={src}
      alt={item.name}
      loading="lazy"
      onError={() => setAttempt((n) => Math.min(n + 1, choices.length))}
    />
  );
}

export default function App() {
  const [slide, setSlide] = useState(0);
  const [selectedTable, setSelectedTable] = useState(1);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState({});
  const [occupied, setOccupied] = useState({});
  const [message, setMessage] = useState("");
  const [paid, setPaid] = useState(false);

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
    setPaid(false);
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
      setMessage("Please add dishes before placing an order.");
      return;
    }
    setOccupied((old) => ({ ...old, [selectedTable]: true }));
    setMessage(`Order placed successfully for Table ${selectedTable}.`);
  }

  function completePayment() {
    if (!cart.length) {
      setMessage("Add items before completing payment.");
      return;
    }
    if (!window.confirm(`Confirm payment of ${money(total)}?`)) return;

    setOrders((old) => ({ ...old, [selectedTable]: [] }));
    setOccupied((old) => ({ ...old, [selectedTable]: false }));
    setPaid(true);
    setMessage(`Payment completed for Table ${selectedTable}.`);
  }

  const go = (n) => {
    setSlide(Math.max(0, Math.min(3, n)));
    setMessage("");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" onClick={() => go(0)}>
          <span className="brand-mark">T<span>B</span></span>
          <span>
            <strong>TableBite</strong>
            <small>Restaurant Studio</small>
          </span>
        </a>
        <div className="topbar-right">
          <span className="online-dot" /> Live dashboard
          <span className="topbar-divider" />
          <span>Table {selectedTable}</span>
        </div>
      </header>

      <main className="dashboard" id="top">
        <div className="stepper" aria-label="App screens">
          {["Overview", "Menu", "Your order", "Checkout"].map((name, i) => (
            <button
              key={name}
              className={slide === i ? "step active" : "step"}
              onClick={() => go(i)}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {name}
            </button>
          ))}
        </div>

        {slide === 0 && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <span className="eyebrow">A BETTER DINING EXPERIENCE</span>
                <h1>Good food.<br /><em>Beautiful moments.</em></h1>
                <p>
                  Welcome to TableBite — your elegant space to explore delicious
                  food and manage every order with ease.
                </p>
                <button className="button button-dark" onClick={() => go(1)}>
                  Explore the menu <span>↗</span>
                </button>
              </div>
              <div className="hero-art">
                <img
                  src={imageUrl("photo-1414235077428-338989a2e8c0")}
                  alt="Beautifully served restaurant meal"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://placehold.co/800x600/ece2d4/5d4935?text=TableBite";
                  }}
                />
                <div className="hero-sticker">
                  <span>✦</span>
                  <strong>Made with<br />love & flavour</strong>
                </div>
              </div>
            </section>

            <section className="stat-grid">
              <article className="stat-card">
                <span className="stat-symbol">⌂</span>
                <div><p>Total tables</p><h2>{tables.length}</h2><small>Ready for guests</small></div>
              </article>
              <article className="stat-card">
                <span className="stat-symbol green">●</span>
                <div><p>Occupied tables</p><h2>{occupiedCount}</h2><small>Currently dining</small></div>
              </article>
              <article className="stat-card">
                <span className="stat-symbol gold">✦</span>
                <div><p>Available tables</p><h2>{tables.length - occupiedCount}</h2><small>Welcome new guests</small></div>
              </article>
              <article className="stat-card">
                <span className="stat-symbol rose">₹</span>
                <div><p>Current table bill</p><h2>{money(total)}</h2><small>Including 5% demo GST</small></div>
              </article>
            </section>

            <section className="panel table-panel">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">FLOOR PLAN</span>
                  <h2>Choose a table</h2>
                  <p>Select a table to start a fresh order or continue an existing one.</p>
                </div>
                <span className="soft-pill">{occupiedCount} occupied</span>
              </div>
              <div className="table-grid">
                {tables.map((table) => (
                  <button
                    key={table}
                    onClick={() => {
                      setSelectedTable(table);
                      setMessage("");
                      setPaid(false);
                    }}
                    className={`table-tile ${selectedTable === table ? "chosen" : ""} ${occupied[table] ? "busy" : ""}`}
                  >
                    <span className="table-icon">♧</span>
                    <strong>Table {table}</strong>
                    <small>
                      {occupied[table] ? "Occupied" : selectedTable === table ? "Selected" : "Available"}
                    </small>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {slide === 1 && (
          <section className="panel menu-panel">
            <div className="section-heading menu-title">
              <div>
                <span className="eyebrow">FRESH FROM OUR KITCHEN</span>
                <h1>Explore the menu<span className="title-dot">.</span></h1>
                <p>Comfort food, refreshing sips and something sweet for every mood.</p>
              </div>
              <span className="soft-pill">{filteredMenu.length} dishes</span>
            </div>

            <div className="menu-tools">
              <label className="search-box">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search dishes..."
                />
              </label>
              <div className="category-list">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={category === cat ? "category-chip active" : "category-chip"}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="food-grid">
              {filteredMenu.map((item) => (
                <article className="food-card" key={item.id}>
                  <div className="food-image-wrap">
                    <FoodImage item={item} className="food-image" />
                    {item.tag && <span className="food-tag">{item.tag}</span>}
                    <button className="quick-add" onClick={() => updateCart(item, 1)} aria-label={`Add ${item.name}`}>+</button>
                  </div>
                  <div className="food-card-body">
                    <div>
                      <span className="food-category">{item.category}</span>
                      <h3>{item.name}</h3>
                    </div>
                    <div className="food-card-bottom">
                      <strong>{money(item.price)}</strong>
                      <button className="add-link" onClick={() => updateCart(item, 1)}>
                        Add to order <span>↗</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {!filteredMenu.length && (
              <div className="empty-state">No dishes found. Try another search or category.</div>
            )}

            <div className="menu-footer">
              <span>{itemCount} item(s) in your order</span>
              <button className="button button-dark" onClick={() => go(2)}>
                View your order <span>→</span>
              </button>
            </div>
          </section>
        )}

        {slide === 2 && (
          <section className="panel order-panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">ALMOST THERE</span>
                <h1>Your order<span className="title-dot">.</span></h1>
                <p>Everything selected for Table {selectedTable}, all in one place.</p>
              </div>
              <span className="soft-pill">{itemCount} items</span>
            </div>

            <div className="order-layout">
              <div className="order-list">
                {!cart.length ? (
                  <div className="empty-cart">
                    <span>♧</span>
                    <h3>Your table is waiting</h3>
                    <p>Your order is empty. Browse the menu and add something delicious.</p>
                    <button className="button button-dark" onClick={() => go(1)}>Browse menu ↗</button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <article className="order-row" key={item.id}>
                      <FoodImage item={item} className="order-image" />
                      <div className="order-description">
                        <h3>{item.name}</h3>
                        <p>{item.category}</p>
                        <strong>{money(item.price)}</strong>
                      </div>
                      <div className="quantity-control">
                        <button onClick={() => updateCart(item, -1)} aria-label={`Remove one ${item.name}`}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateCart(item, 1)} aria-label={`Add one ${item.name}`}>+</button>
                      </div>
                      <strong className="line-total">{money(item.price * item.qty)}</strong>
                    </article>
                  ))
                )}
                <button className="text-button" onClick={() => go(1)}>← Continue browsing</button>
              </div>

              <aside className="summary-card">
                <span className="eyebrow">ORDER SUMMARY</span>
                <h2>Table {selectedTable}</h2>
                <div className="summary-line"><span>Items</span><span>{itemCount}</span></div>
                <div className="summary-line"><span>Subtotal</span><span>{money(subtotal)}</span></div>
                <div className="summary-line"><span>GST (5%)</span><span>{money(gst)}</span></div>
                <div className="summary-total"><span>Total</span><strong>{money(total)}</strong></div>
                <button className="button button-dark full" onClick={() => go(3)}>Continue to checkout <span>→</span></button>
                <button className="button button-outline full" onClick={placeOrder}>Place order</button>
                <p className="fine-print">GST is illustrative for this demo. Confirm the applicable rate before real use.</p>
              </aside>
            </div>
            {message && <p className="notice" role="status">{message}</p>}
          </section>
        )}

        {slide === 3 && (
          <section className="panel checkout-panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">THE FINAL STEP</span>
                <h1>Checkout<span className="title-dot">.</span></h1>
                <p>Review your bill before completing your table payment.</p>
              </div>
              <span className="soft-pill">Table {selectedTable}</span>
            </div>

            {paid ? (
              <div className="payment-success">
                <span>✓</span>
                <h2>Payment completed</h2>
                <p>{message || `Thank you! Table ${selectedTable} has been settled.`}</p>
                <button className="button button-dark" onClick={() => { setPaid(false); go(0); }}>
                  Back to dashboard ↗
                </button>
              </div>
            ) : (
              <div className="checkout-layout">
                <div className="receipt-card">
                  <div className="receipt-brand">
                    <span className="brand-mark small-mark">T<span>B</span></span>
                    <div><h2>TableBite</h2><p>Good food, good company.</p></div>
                  </div>
                  <div className="receipt-meta"><span>ORDER SUMMARY</span><span>TABLE {selectedTable}</span></div>
                  {!cart.length ? (
                    <div className="empty-state">Your order is empty. Add dishes from the menu first.</div>
                  ) : cart.map((item) => (
                    <div className="summary-line receipt-line" key={item.id}>
                      <span>{item.name} <small>× {item.qty}</small></span>
                      <strong>{money(item.price * item.qty)}</strong>
                    </div>
                  ))}
                  <div className="receipt-divider" />
                  <div className="summary-line"><span>Subtotal</span><span>{money(subtotal)}</span></div>
                  <div className="summary-line"><span>GST (5%)</span><span>{money(gst)}</span></div>
                  <div className="summary-total"><span>Amount due</span><strong>{money(total)}</strong></div>
                  <p className="receipt-thanks">Thank you for choosing TableBite ✦</p>
                </div>

                <div className="checkout-actions">
                  <div className="checkout-icon">₹</div>
                  <span className="eyebrow">PAYMENT DETAILS</span>
                  <h2>All set to settle?</h2>
                  <p>Check your total and print a receipt, or confirm this demo payment.</p>
                  <button className="button button-outline full" onClick={() => window.print()}>Print bill <span>↗</span></button>
                  <button className="button button-dark full" disabled={!cart.length} onClick={completePayment}>
                    Confirm payment · {money(total)}
                  </button>
                  <button className="text-button" onClick={() => go(2)}>← Back to your order</button>
                  <p className="fine-print">Demo only — no real payment will be processed.</p>
                </div>
              </div>
            )}
            {message && !paid && <p className="notice" role="status">{message}</p>}
          </section>
        )}

        <div className="bottom-navigation">
          <button className="button button-outline" disabled={slide === 0} onClick={() => go(slide - 1)}>← Previous</button>
          <div className="dots">
            {[0, 1, 2, 3].map((n) => (
              <button key={n} aria-label={`Go to screen ${n + 1}`} className={slide === n ? "dot active" : "dot"} onClick={() => go(n)} />
            ))}
          </div>
          <span className="screen-count">0{slide + 1} <i>/ 04</i></span>
          <button className="button button-dark" disabled={slide === 3} onClick={() => go(slide + 1)}>Next screen <span>→</span></button>
        </div>
      </main>

      <footer className="footer">
        <span>© 2026 TableBite</span>
        <span>Thoughtfully made for better dining.</span>
      </footer>
    </div>
  );
}
