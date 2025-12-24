
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Snowfall from './components/Snowfall';
import SantaChat from './components/SantaChat';
import { Product, CartItem, Page } from './types';
import { PRODUCTS } from './constants';

interface Floater {
  id: number;
  x: number;
  y: number;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [floaters, setFloaters] = useState<Floater[]>([]);

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

  const handleCheckout = () => {
    if (cart.length === 0) return;
    completeOrder();
  };

  const completeOrder = () => {
    setCart([]);
    setCurrentPage('success');
  };

  const renderHome = () => (
    <div className="animate-fade-in">
      <section className="text-center py-16 bg-[url('https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center text-white relative">
        <div className="absolute inset-0 bg-red-900/60"></div>
        <div className="relative z-10 px-4">
          <h2 className="text-5xl md:text-7xl font-christmas font-bold mb-4 drop-shadow-lg">Merry Christmas Treats</h2>
          <p className="text-xl md:text-2xl font-light mb-8 max-w-2xl mx-auto">Discover the magic in every bite. Festive fusion flavors delivered to your doorstep.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-christmas text-red-800 text-center mb-12">Our Signature Bites</h3>
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {PRODUCTS.map(product => (
            <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-red-100 group">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-yellow-500 text-red-900 font-bold px-4 py-1 rounded-full shadow-md">
                  {product.price} pts
                </div>
              </div>
              <div className="p-8">
                <h4 className="text-2xl font-bold text-green-800 mb-2">{product.name}</h4>
                <p className="text-slate-600 mb-4">{product.description}</p>
                <SantaChat productName={product.name} />
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

      <section className="bg-green-800 text-white py-16 mt-12 overflow-hidden relative">
        <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center gap-8 text-4xl mb-4">
                <span>🍪</span><span>🥛</span><span>🦌</span>
            </div>
            <h4 className="text-3xl font-christmas mb-4">Handcrafted with Holiday Joy</h4>
            <p className="max-w-xl mx-auto opacity-90">Every bite is prepared with fresh ingredients and a sprinkle of Christmas magic to ensure your celebrations are berry merry!</p>
        </div>
      </section>
    </div>
  );

  const renderCart = () => (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h2 className="text-4xl font-christmas text-red-800 mb-8 text-center">Your Gift Sack</h2>
      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-inner border-2 border-dashed border-red-200">
          <p className="text-xl text-slate-400 mb-6">Your sack is empty! Go find some treats.</p>
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
              onClick={handleCheckout}
              className="w-full bg-red-600 text-white font-bold py-5 rounded-2xl text-xl hover:bg-red-700 transition-colors shadow-lg"
            >
              Confirm and Order 🦌
            </button>
          </div>
        </div>
      )}
    </div>
  );

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
                <p className="text-2xl text-slate-700 font-semibold">Your festive treats are on the way!</p>
                <p className="text-lg text-slate-500 italic">Santa's elves are packing your sack with extra magic and holiday cheer as we speak.</p>
            </div>
            <button 
                onClick={() => setCurrentPage('home')}
                className="bg-red-600 text-white px-12 py-5 rounded-2xl font-bold hover:bg-red-700 transition-all text-xl shadow-xl shadow-red-200 active:scale-95"
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
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="font-christmas text-2xl text-white mb-4">Berry Merry Bites</p>
          <div className="flex justify-center gap-6 mb-6">
            <span className="text-xl">🍪</span>
            <span className="text-xl">🥨</span>
            <span className="text-xl">🍓</span>
            <span className="text-xl">🍫</span>
          </div>
          <p className="text-sm">© 2024 North Pole Delivery Service. All treats are elf-tested and Santa-approved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
