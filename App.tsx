
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Snowfall from './components/Snowfall';
import SantaChat from './components/SantaChat';
import { Product, CartItem, Page, Order } from './types';
import { PRODUCTS } from './constants';

interface Floater {
  id: number;
  x: number;
  y: number;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  // Initialize orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('berry_merry_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }

    const savedAdmin = localStorage.getItem('berry_merry_admin_unlocked');
    if (savedAdmin === 'true') {
      setIsAdminUnlocked(true);
    }

    // Real-time listener for cross-tab updates (Single Device)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'berry_merry_orders' && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSecretUnlock = () => {
    const newState = !isAdminUnlocked;
    setIsAdminUnlocked(newState);
    localStorage.setItem('berry_merry_admin_unlocked', String(newState));
    if (newState) {
      alert("🎅 Ho Ho Ho! Welcome to the North Pole Command Center.");
    }
  };

  const addToCart = (product: Product, e?: React.MouseEvent) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    if (e) {
      const newFloater = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      };
      setFloaters(prev => [...prev, newFloater]);
      
      setTimeout(() => {
        setFloaters(prev => prev.filter(f => f.id !== newFloater.id));
      }, 1000);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const completeOrder = () => {
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toLocaleString(),
      items: [...cart],
      totalPoints: cartTotal
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('berry_merry_orders', JSON.stringify(updatedOrders));
    
    setCart([]);
    setCurrentPage('success');
  };

  const exportData = () => {
    const dataStr = JSON.stringify(orders);
    navigator.clipboard.writeText(dataStr);
    alert("Order data copied to clipboard! You can now paste this on another device to sync.");
  };

  const importData = () => {
    const input = prompt("Paste the exported Order JSON string here:");
    if (input) {
      try {
        const newOrders = JSON.parse(input);
        if (Array.isArray(newOrders)) {
          // Merge logic: avoid duplicates based on ID
          const merged = [...orders];
          newOrders.forEach(no => {
            if (!merged.find(mo => mo.id === no.id)) {
              merged.push(no);
            }
          });
          // Sort by timestamp (newest first)
          merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          
          setOrders(merged);
          localStorage.setItem('berry_merry_orders', JSON.stringify(merged));
          alert("Import successful! Orders merged.");
        }
      } catch (e) {
        alert("Invalid data format. Please paste a valid Order JSON.");
      }
    }
  };

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all order history? This cannot be undone.")) {
      setOrders([]);
      localStorage.removeItem('berry_merry_orders');
    }
  };

  const renderHome = () => (
    <div className="animate-fade-in">
      <section className="text-center py-16 bg-[url('https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center text-white relative">
        <div className="absolute inset-0 bg-red-900/60"></div>
        <div className="relative z-10 px-4">
          <h2 className="text-5xl md:text-7xl font-christmas font-bold mb-4 drop-shadow-lg">Merry Christmas Treats</h2>
          <p className="text-xl md:text-2xl font-light mb-8 max-w-2xl mx-auto">Discover the magic in every bite. Festive fusion flavors and games delivered to your doorstep.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h3 className="text-4xl font-christmas text-red-800 text-center mb-12 underline decoration-green-600 decoration-wavy underline-offset-8">Our Festive Collection</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {PRODUCTS.map(product => (
            <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-red-100 group flex flex-col h-full">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-yellow-500 text-red-900 font-bold px-4 py-1 rounded-full shadow-md z-10">
                  {product.price} pts
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex-grow">
                  <h4 className="text-2xl font-bold text-green-800 mb-2">{product.name}</h4>
                  <p className="text-slate-600 mb-4">{product.description}</p>
                  <SantaChat productName={product.name} />
                </div>
                <button 
                  onClick={(e) => addToCart(product, e)}
                  className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-200"
                >
                  <span>🎁</span> Add to Sack
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderCart = () => (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h2 className="text-4xl font-christmas text-red-800 mb-8 text-center">Your Gift Sack</h2>
      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-inner border-2 border-dashed border-red-200">
          <p className="text-xl text-slate-400 mb-6">Your sack is empty! Go find some treats or games.</p>
          <button 
            onClick={() => setCurrentPage('home')}
            className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-red-50">
          <div className="divide-y divide-red-50">
            {cart.map(item => (
              <div key={item.id} className="p-6 flex items-center gap-6 flex-wrap md:flex-nowrap">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                <div className="flex-grow">
                  <h4 className="text-xl font-bold text-slate-800">{item.name}</h4>
                  <p className="text-green-700 font-bold">{item.price} pts</p>
                </div>
                <div className="flex items-center gap-4 bg-red-50 px-4 py-2 rounded-full">
                  <button onClick={() => updateQuantity(item.id, -1)} className="text-red-700 font-bold text-xl hover:text-red-900">-</button>
                  <span className="font-bold w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="text-red-700 font-bold text-xl hover:text-red-900">+</button>
                </div>
                <div className="text-right min-w-[100px]">
                  <p className="font-bold text-xl text-slate-900">{item.price * item.quantity} pts</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm hover:underline">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-red-50 p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl text-slate-600 font-medium">Sack Total:</span>
              <span className="text-3xl font-bold text-red-800">{cartTotal} points</span>
            </div>
            <button 
              onClick={completeOrder}
              className="w-full bg-red-600 text-white font-bold py-5 rounded-2xl text-xl hover:bg-red-700 transition-colors shadow-lg"
            >
              Confirm and Order 🦌
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderAdmin = () => {
    const totalPoints = orders.reduce((sum, order) => sum + order.totalPoints, 0);
    const avgOrderValue = orders.length > 0 ? (totalPoints / orders.length).toFixed(1) : 0;

    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h2 className="text-4xl font-christmas text-red-800 mb-2">North Pole Command Center</h2>
            <p className="text-slate-500 italic">Tracking festive magic across the globe.</p>
          </div>
          <div className="flex gap-2">
             <button 
              onClick={exportData}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-md"
              title="Export order data to move to another device"
            >
              Export 📤
            </button>
            <button 
              onClick={importData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-md"
              title="Import order data from another device"
            >
              Import 📥
            </button>
            <button 
              onClick={clearAllData}
              className="bg-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm hover:bg-red-100 hover:text-red-600 transition-colors"
            >
              Reset 🧹
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-red-600 to-red-800 p-8 rounded-3xl text-white shadow-xl shadow-red-200 border-b-4 border-yellow-500">
            <p className="text-red-100 mb-2 uppercase tracking-wider text-sm font-bold">Total Points Earned</p>
            <p className="text-5xl font-bold tracking-tighter">{totalPoints} <span className="text-2xl font-light">pts</span></p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-xl shadow-slate-100 border-b-4 border-green-600">
            <p className="text-slate-400 mb-2 uppercase tracking-wider text-sm font-bold">Total Orders</p>
            <p className="text-5xl font-bold text-green-700 tracking-tighter">{orders.length}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-xl shadow-slate-100 border-b-4 border-yellow-600">
            <p className="text-slate-400 mb-2 uppercase tracking-wider text-sm font-bold">Avg Order Value</p>
            <p className="text-5xl font-bold text-yellow-600 tracking-tighter">{avgOrderValue} <span className="text-2xl font-light">pts</span></p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-red-50">
          <div className="p-6 border-b border-red-50 bg-red-50/50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800">Master Order Log</h3>
            <span className="text-xs text-slate-400">Updates in real-time on this device</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm uppercase">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-slate-400">
                      No orders detected. The elves are waiting for the first customer!
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-red-600 font-bold">{order.id}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{order.timestamp}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((item, idx) => (
                            <span key={idx} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full border border-green-100">
                              {item.quantity}x {item.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">{order.totalPoints} pts</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <p className="mt-6 text-center text-slate-400 text-xs">
          💡 For production usage across multiple devices, connect this app to a cloud database like Firebase. 
          Currently, use the <b>Export/Import</b> buttons to manually sync order data between devices.
        </p>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="container mx-auto px-4 py-20 text-center animate-pop-in">
        <div className="bg-white max-w-xl mx-auto rounded-3xl p-12 shadow-2xl border-b-8 border-green-600">
            <div className="flex justify-center mb-8">
                <div className="checkmark-circle">
                    <div className="background"></div>
                    <div className="checkmark draw"></div>
                </div>
            </div>
            <h2 className="text-5xl font-christmas text-red-800 mb-6 font-bold tracking-tight">Ho Ho Ho! Order Received!</h2>
            <div className="space-y-4 mb-10">
                <p className="text-2xl text-slate-700 font-semibold">Your festive items are on the way!</p>
                <p className="text-lg text-slate-500 italic">Santa's elves are packing your sack with extra magic and holiday cheer as we speak.</p>
            </div>
            <button 
                onClick={() => setCurrentPage('home')}
                className="bg-red-600 text-white px-12 py-5 rounded-2xl font-bold hover:bg-red-700 transition-all text-xl shadow-xl shadow-red-200"
            >
                Back to Festive Shop 🎄
            </button>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Snowfall />
      <Header 
        cartCount={cartCount} 
        onNavigate={setCurrentPage} 
        currentPage={currentPage} 
        isAdminUnlocked={isAdminUnlocked}
        onSecretUnlock={handleSecretUnlock}
      />
      
      {floaters.map(floater => (
        <div 
          key={floater.id} 
          className="floating-plus-one font-christmas"
          style={{ left: floater.x, top: floater.y }}
        >
          +1
        </div>
      ))}

      <main className="flex-grow">
        {currentPage === 'home' && renderHome()}
        {currentPage === 'cart' && renderCart()}
        {currentPage === 'success' && renderSuccess()}
        {currentPage === 'admin' && renderAdmin()}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="font-christmas text-2xl text-white mb-4">Berry Merry Bites</p>
          <div className="flex justify-center gap-6 mb-6">
            <span className="text-xl">🍪</span>
            <span className="text-xl">🥨</span>
            <span className="text-xl">🍓</span>
            <span className="text-xl">🎮</span>
          </div>
          <p className="text-sm">© 2024 North Pole Delivery Service. Real-time Christmas commerce.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
