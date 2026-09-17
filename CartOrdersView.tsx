import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle2,
  Coins,
  Sparkles,
  Layers,
  ChevronRight,
  Bike
} from 'lucide-react';
import { CartItem, Order, OrderStatus, PlatformName } from '../types';
import { RoomDB } from '../utils/storage';

interface CartOrdersViewProps {
  cart: CartItem[];
  orders: Order[];
  coins: number;
  onUpdateCart: (cart: CartItem[]) => void;
  onPlaceOrder: (order: Order) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const PLATFORMS: { name: PlatformName; color: string; fee: number; promo: string; discountRate: number }[] = [
  { name: 'Swiggy', color: '#FC8019', fee: 0, promo: 'SWIGGYIT', discountRate: 0.35 },
  { name: 'Zomato', color: '#E23744', fee: 15, promo: 'ZOMATO50', discountRate: 0.3 },
  { name: 'EatSure', color: '#6B3CE8', fee: 0, promo: 'EATSURE100', discountRate: 0.25 },
  { name: 'Magicpin', color: '#1A82E2', fee: 20, promo: 'MAGIC40', discountRate: 0.4 },
];

export const CartOrdersView: React.FC<CartOrdersViewProps> = ({
  cart,
  orders,
  coins,
  onUpdateCart,
  onPlaceOrder,
  onUpdateOrderStatus,
}) => {
  const [selectedGlobalPlatform, setSelectedGlobalPlatform] = useState<PlatformName>('Swiggy');
  const [appliedCoupon, setAppliedCoupon] = useState('SWIGGYIT');
  const [useCoins, setUseCoins] = useState(true);
  const [activeTab, setActiveTab] = useState<'cart' | 'live_order' | 'history'>('cart');
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);

  // Active tracking order (either latest or selected)
  const latestOrder = orders.length > 0 ? orders[0] : null;
  const trackingOrder = activeTrackingOrderId
    ? orders.find((o) => o.id === activeTrackingOrderId) || latestOrder
    : latestOrder;

  // Auto-progress simulated order status over time
  useEffect(() => {
    if (!trackingOrder || trackingOrder.status === 'delivered') return;

    const timer = setTimeout(() => {
      if (trackingOrder.status === 'placed') {
        onUpdateOrderStatus(trackingOrder.id, 'confirmed');
      } else if (trackingOrder.status === 'confirmed') {
        onUpdateOrderStatus(trackingOrder.id, 'cooking');
      } else if (trackingOrder.status === 'cooking') {
        onUpdateOrderStatus(trackingOrder.id, 'out_for_delivery');
      } else if (trackingOrder.status === 'out_for_delivery') {
        onUpdateOrderStatus(trackingOrder.id, 'delivered');
        confetti({ particleCount: 80, spread: 60 });
      }
    }, 12000);

    return () => clearTimeout(timer);
  }, [trackingOrder?.status, trackingOrder?.id]);

  // Cart quantity controls
  const handleUpdateQty = (cartItemId: string, change: number) => {
    const updated = cart
      .map((item) => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    onUpdateCart(updated);
  };

  const handleSwitchPlatform = (platform: PlatformName) => {
    setSelectedGlobalPlatform(platform);
    const platformConfig = PLATFORMS.find((p) => p.name === platform);
    if (platformConfig) {
      setAppliedCoupon(platformConfig.promo);
    }
  };

  // Bill Calculations
  const itemTotal = cart.reduce((sum, item) => {
    const matchedDeal = item.foodItem.platforms.find((p) => p.platformName === selectedGlobalPlatform);
    const price = matchedDeal ? matchedDeal.offerPrice : item.foodItem.price;
    return sum + price * item.quantity;
  }, 0);

  const selectedPlatformConfig = PLATFORMS.find((p) => p.name === selectedGlobalPlatform) || PLATFORMS[0];
  const couponDiscount = Math.round(itemTotal * 0.15); // additional coupon discount
  const coinDiscount = useCoins ? Math.min(coins, 40) : 0;
  const deliveryFee = selectedPlatformConfig.fee;
  const platformFee = 5;
  const netPayable = Math.max(itemTotal - couponDiscount - coinDiscount + deliveryFee + platformFee, 0);

  // Simulated Order Checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });

    const newOrder: Order = {
      id: `CRV-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      itemTotal,
      totalDiscount: couponDiscount + coinDiscount,
      deliveryFee,
      platformFee,
      netPayable,
      platformUsed: selectedGlobalPlatform,
      promoCodeApplied: appliedCoupon,
      deliveryAddress: 'Home - 402, Lotus Heights, Indiranagar 100ft Rd',
      status: 'placed',
      orderTimestamp: Date.now(),
      estimatedDeliveryTimestamp: Date.now() + 25 * 60 * 1000,
      rider: {
        name: 'Rahul Sharma',
        phone: '+91 98765 43210',
        vehicleNumber: 'KA 03 EV 8892 (Ather 450X)',
        rating: 4.9,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      },
      stepLogs: [
        { step: 'placed', label: 'Order Received & Sent to Kitchen', time: 'Just now', completed: true },
        { step: 'confirmed', label: 'Restaurant Confirmed & Heating Tandoor', time: '2m', completed: false },
        { step: 'cooking', label: 'Chef Cooking & Packing in Sealed Pod', time: '8m', completed: false },
        { step: 'out_for_delivery', label: 'Rider Rahul Sharma Picked Up Order', time: '14m', completed: false },
        { step: 'delivered', label: 'Delivered at Doorstep', time: '22m', completed: false },
      ],
    };

    onPlaceOrder(newOrder);
    onUpdateCart([]); // clear cart
    setActiveTrackingOrderId(newOrder.id);
    setActiveTab('live_order');
    RoomDB.addCoins(35); // reward cashback coins
  };

  return (
    <div
      id="cart-orders-view"
      className="flex-1 w-full h-full bg-black overflow-y-auto p-4 space-y-4 text-neutral-100 pb-20 select-none"
    >
      {/* Top Segmented Control (Cart vs Live Order vs Order History) */}
      <div className="flex items-center p-1 rounded-2xl bg-neutral-900 border border-red-950/60 text-xs font-bold shadow-md">
        <button
          onClick={() => setActiveTab('cart')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'cart'
              ? 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
        </button>

        <button
          onClick={() => setActiveTab('live_order')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'live_order'
              ? 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Bike className="w-3.5 h-3.5 text-amber-200" />
          <span>Live Tracking</span>
          {latestOrder && latestOrder.status !== 'delivered' && (
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <span>History ({orders.length})</span>
        </button>
      </div>

      {/* TAB 1: CART VIEW */}
      {activeTab === 'cart' && (
        <div className="space-y-4">
          {cart.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto border border-orange-500/20">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-sm text-neutral-200">Your Cart is Empty</h3>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Swipe through food reels or use the Smart Crave matcher to discover delicious deals!
              </p>
            </div>
          ) : (
            <>
              {/* Platform Switcher Bar */}
              <div className="p-3 rounded-2xl bg-neutral-900/90 border border-red-950/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-neutral-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-orange-400" />
                    Compare Total Cart on Partner Networks:
                  </span>
                  <span className="text-[10px] text-orange-400 font-bold">Auto-Coupons</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {PLATFORMS.map((p) => {
                    const isSelected = selectedGlobalPlatform === p.name;
                    return (
                      <button
                        key={p.name}
                        onClick={() => handleSwitchPlatform(p.name)}
                        className={`p-2 rounded-xl text-center border transition cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-800 border-orange-500 text-white shadow-md ring-1 ring-orange-500/50'
                            : 'bg-black/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full mx-auto mb-1 flex items-center justify-center text-[8px] font-bold text-white"
                          style={{ backgroundColor: p.color }}
                        >
                          {p.name[0]}
                        </div>
                        <div className="text-[10px] font-bold truncate">{p.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-2.5">
                {cart.map((item) => {
                  const deal =
                    item.foodItem.platforms.find((p) => p.platformName === selectedGlobalPlatform) ||
                    item.foodItem.platforms[0];

                  return (
                    <div
                      key={item.cartItemId}
                      id={`cart-item-${item.cartItemId}`}
                      className="p-3 rounded-2xl bg-neutral-900/80 border border-red-950/50 flex items-center justify-between gap-3 shadow-md"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-neutral-700">
                        <img
                          src={item.foodItem.posterUrl}
                          alt={item.foodItem.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-xs bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                          {item.foodItem.name}
                        </h4>
                        <p className="text-[11px] text-neutral-400 truncate">{item.foodItem.restaurant}</p>
                        <div className="text-xs font-black text-emerald-400 mt-0.5">
                          ₹{deal.offerPrice} <span className="text-[10px] text-neutral-500 font-normal">each</span>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 bg-black border border-neutral-800 rounded-xl px-2 py-1 shrink-0">
                        <button
                          onClick={() => handleUpdateQty(item.cartItemId, -1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-neutral-400 hover:text-white transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-emerald-400 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.cartItemId, 1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-neutral-400 hover:text-white transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon & Crave Coins Bar */}
              <div className="p-3.5 rounded-2xl bg-neutral-900 border border-red-950/50 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <Tag className="w-3.5 h-3.5 text-orange-400" />
                    <span>Applied Coupon: {appliedCoupon}</span>
                  </div>
                  <span className="text-emerald-400 font-bold text-[11px]">-₹{couponDiscount}</span>
                </div>

                {/* Redeem Coins */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-neutral-300 font-medium">Use {Math.min(coins, 40)} <strong className="font-brand font-black bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">Crave Coins</strong></span>
                  </div>
                  <button
                    onClick={() => setUseCoins(!useCoins)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                      useCoins
                        ? 'bg-gradient-to-r from-red-950/80 to-orange-950/80 text-orange-300 border-orange-500/50'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                    }`}
                  >
                    {useCoins ? 'Applied (-₹' + coinDiscount + ')' : 'Apply Coins'}
                  </button>
                </div>
              </div>

              {/* Bill Details */}
              <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-xs space-y-2">
                <div className="font-bold text-neutral-200 border-b border-neutral-800 pb-1.5">Bill Summary</div>
                <div className="flex justify-between text-neutral-400">
                  <span>Item Total</span>
                  <span className="text-neutral-200">₹{itemTotal}</span>
                </div>
                <div className="flex justify-between text-orange-400">
                  <span>Partner Coupon Savings ({appliedCoupon})</span>
                  <span>-₹{couponDiscount}</span>
                </div>
                {useCoins && (
                  <div className="flex justify-between text-amber-300">
                    <span><strong className="font-brand font-black bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">Crave Coins</strong> Redeemed</span>
                    <span>-₹{coinDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Platform & Packaging Fee</span>
                  <span>₹{platformFee}</span>
                </div>
                <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-black text-neutral-100">
                  <span>To Pay (via {selectedGlobalPlatform})</span>
                  <span className="text-emerald-400 text-base font-black">₹{netPayable}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                id="place-simulated-order-btn"
                onClick={handleCheckout}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:brightness-110 text-white font-black text-sm shadow-[0_0_25px_rgba(249,115,22,0.5)] transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Place Order via {selectedGlobalPlatform} • <strong className="text-emerald-300 font-black">₹{netPayable}</strong></span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )}

      {/* TAB 2: LIVE ORDER TRACKING */}
      {activeTab === 'live_order' && (
        <div className="space-y-4">
          {trackingOrder ? (
            <>
              {/* Order Status Header */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-black via-red-950/30 to-neutral-900 border border-orange-500/40 space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-400">ORDER ID: {trackingOrder.id}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-red-600 to-orange-500 text-white uppercase shadow-sm">
                    {trackingOrder.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h3 className="text-base font-black text-white">
                  {trackingOrder.status === 'delivered'
                    ? '🎉 Order Delivered! Enjoy your meal!'
                    : '⚡ Estimated Delivery in 18 Mins'}
                </h3>
                <p className="text-xs text-neutral-300">
                  Delivering to: <strong className="text-white">{trackingOrder.deliveryAddress}</strong>
                </p>
              </div>

              {/* Live Tracking Map Simulation */}
              <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 relative overflow-hidden h-48 flex flex-col justify-between shadow-inner">
                {/* Visual Map Grid Canvas */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Animated Scooter Route */}
                <div className="relative z-10 flex items-center justify-between w-full px-4 my-auto">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-red-950/80 border border-red-500/60 text-orange-400 flex items-center justify-center font-bold text-xs shadow-lg">
                      🍳
                    </div>
                    <span className="text-[10px] text-neutral-300 font-bold mt-1">Kitchen</span>
                  </div>

                  {/* Route Line with animated pulse */}
                  <div className="flex-1 mx-3 h-1.5 bg-neutral-800 rounded-full relative overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 w-3/4 animate-pulse rounded-full shadow-[0_0_8px_#f97316]" />
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-[0_0_20px_rgba(249,115,22,0.6)] animate-bounce">
                      <Bike className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-orange-300 font-black mt-1">Rahul (Rider)</span>
                  </div>

                  <div className="flex-1 mx-3 h-1.5 bg-neutral-800 rounded-full" />

                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-orange-950/60 border border-orange-500/60 text-orange-400 flex items-center justify-center font-bold text-xs">
                      🏠
                    </div>
                    <span className="text-[10px] text-neutral-300 font-bold mt-1">Your Door</span>
                  </div>
                </div>

                <div className="relative z-10 text-center text-[10px] text-neutral-400">
                  Live GPS Signal • {trackingOrder.rider.vehicleNumber}
                </div>
              </div>

              {/* Rider Profile Card */}
              <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-orange-500/50">
                    <img
                      src={trackingOrder.rider.avatarUrl}
                      alt={trackingOrder.rider.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-100 flex items-center gap-1.5">
                      <span>{trackingOrder.rider.name}</span>
                      <span className="px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-300 text-[10px] font-bold">
                        ★ {trackingOrder.rider.rating}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400">{trackingOrder.rider.vehicleNumber}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Calling delivery rider Rahul Sharma at ${trackingOrder.rider.phone}`)}
                    className="w-8 h-8 rounded-full bg-red-950/80 border border-red-800/60 text-orange-400 hover:bg-red-900 flex items-center justify-center transition"
                    title="Call Rider"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => alert('Message sent: "Please leave order with security if I am away"')}
                    className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700 flex items-center justify-center transition"
                    title="Message Rider"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                <div className="font-bold text-xs text-neutral-200">Delivery Status Timeline</div>
                <div className="space-y-3">
                  {trackingOrder.stepLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <div className="mt-0.5">
                        {log.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-orange-400" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-neutral-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={log.completed ? 'text-neutral-200 font-semibold' : 'text-neutral-500'}>
                          {log.label}
                        </div>
                      </div>
                      <span className="text-[10px] text-neutral-500">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-2">
              <h3 className="font-bold text-sm text-neutral-200">No Active Orders</h3>
              <p className="text-xs text-neutral-400">Place an order to see live GPS tracking and delivery ETA!</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ORDER HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="p-8 text-center text-neutral-400 text-xs">No past orders in Room Database yet.</div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                id={`past-order-${ord.id}`}
                className="p-3.5 rounded-2xl bg-neutral-900 border border-red-950/60 space-y-2.5 shadow-md"
              >
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <div>
                    <span className="font-bold text-xs text-neutral-200">{ord.id}</span>
                    <div className="text-[10px] text-neutral-400">
                      {new Date(ord.orderTimestamp).toLocaleDateString()} via {ord.platformUsed}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    {ord.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-neutral-300">
                      <span>
                        {it.quantity}x <span className="font-black bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">{it.foodItem.name}</span>
                      </span>
                      <span className="text-emerald-400 font-black">₹{it.foodItem.price * it.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-300">Paid <strong className="text-emerald-400 font-black">₹{ord.netPayable}</strong></span>
                  <button
                    onClick={() => {
                      setActiveTrackingOrderId(ord.id);
                      setActiveTab('live_order');
                    }}
                    className="text-[11px] font-bold text-neutral-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Tracking</span>
                    <ChevronRight className="w-3 h-3 text-orange-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
