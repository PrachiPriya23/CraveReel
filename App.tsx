import React, { useState, useEffect } from 'react';
import { AndroidFrame } from './components/AndroidFrame';
import { TopAppBar } from './components/TopAppBar';
import { JetpackNavbar } from './components/JetpackNavbar';
import { ReelsView } from './components/ReelsView';
import { SmartCraveEngine } from './components/SmartCraveEngine';
import { CraveAIPage } from './components/CraveAIPage';
import { SearchExploreView } from './components/SearchExploreView';
import { CartOrdersView } from './components/CartOrdersView';
import { PlatformCompareModal } from './components/PlatformCompareModal';
import { RestaurantCompareModal } from './components/RestaurantCompareModal';
import { INITIAL_FOOD_ITEMS } from './data/foodItems';
import { FoodItem, CartItem, Order, OrderStatus, PlatformName, UserPreferences, ActiveTab, DietaryFilter } from './types';
import { RoomDB } from './utils/storage';

export default function App() {
  const [isFramed, setIsFramed] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('reels');
  const [foodItems] = useState<FoodItem[]>(INITIAL_FOOD_ITEMS);
  const [likedIds, setLikedIds] = useState<string[]>(() => RoomDB.getLikedIds());
  const [cart, setCart] = useState<CartItem[]>(() => RoomDB.getCart());
  const [orders, setOrders] = useState<Order[]>(() => RoomDB.getOrders());
  const [coins, setCoins] = useState<number>(() => RoomDB.getCoins());
  const [preferences, setPreferences] = useState<UserPreferences>(() => RoomDB.getPreferences());
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>('all');

  // Modals state
  const [selectedModalFood, setSelectedModalFood] = useState<FoodItem | null>(null);
  const [activeModal, setActiveModal] = useState<'platform_compare' | 'restaurant_compare' | null>(null);

  // Sync dietary filter with preferences
  const handleSelectDietaryFilter = (filter: DietaryFilter) => {
    setDietaryFilter(filter);
    const updatedPref = {
      ...preferences,
      vegOnly: filter === 'veg',
      dietaryFilter: filter,
    };
    setPreferences(updatedPref);
    RoomDB.savePreferences(updatedPref);
  };

  const handleUpdatePreferences = (pref: UserPreferences) => {
    setPreferences(pref);
    RoomDB.savePreferences(pref);
  };

  // Like toggle
  const handleToggleLike = (id: string) => {
    const updated = RoomDB.toggleLike(id);
    setLikedIds(updated);
    RoomDB.addCoins(5);
    setCoins(RoomDB.getCoins());
  };

  // Add to cart
  const handleAddToCart = (item: FoodItem, platform: PlatformName) => {
    const existingIndex = cart.findIndex(
      (c) => c.foodItem.id === item.id && c.selectedPlatform === platform
    );

    let updatedCart: CartItem[];
    if (existingIndex >= 0) {
      updatedCart = cart.map((c, idx) =>
        idx === existingIndex ? { ...c, quantity: c.quantity + 1 } : c
      );
    } else {
      const newItem: CartItem = {
        cartItemId: `${item.id}_${platform}_${Date.now()}`,
        foodItem: item,
        quantity: 1,
        selectedPlatform: platform,
        addedAt: Date.now(),
      };
      updatedCart = [newItem, ...cart];
    }

    setCart(updatedCart);
    RoomDB.saveCart(updatedCart);
    if (activeModal) {
      setActiveModal(null);
    }
  };

  // Place order
  const handlePlaceOrder = (newOrder: Order) => {
    const updated = RoomDB.saveOrder(newOrder);
    setOrders(updated);
    setCart([]);
    RoomDB.saveCart([]);
    setCoins(RoomDB.getCoins());
  };

  // Order status update
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = RoomDB.updateOrderStatus(orderId, status);
    setOrders(updated);
  };

  // Modal open handlers
  const handleOpenPlatformCompare = (item: FoodItem) => {
    setSelectedModalFood(item);
    setActiveModal('platform_compare');
  };

  const handleOpenRestaurantCompare = (item: FoodItem) => {
    setSelectedModalFood(item);
    setActiveModal('restaurant_compare');
  };

  // Ask AI handler
  const handleAskAIAboutDish = (item: FoodItem) => {
    setSelectedModalFood(item);
    setActiveTab('crave_ai');
  };

  // Filtered food items based on Dietary Filter (all | veg | non-veg)
  const visibleFoodItems = dietaryFilter === 'veg'
    ? foodItems.filter((f) => f.isVeg)
    : dietaryFilter === 'non-veg'
    ? foodItems.filter((f) => !f.isVeg)
    : foodItems;

  return (
    <AndroidFrame isFramed={isFramed} onToggleFrame={() => setIsFramed(!isFramed)}>
      {/* Top App Bar with Location and Veg / Non-Veg Filter (shown on tabs other than full-screen Reels) */}
      {activeTab !== 'reels' && (
        <TopAppBar
          activeTab={activeTab}
          coins={coins}
          dietaryFilter={dietaryFilter}
          onSelectDietaryFilter={handleSelectDietaryFilter}
        />
      )}

      {/* Main View Container */}
      <div className={`flex-1 w-full relative overflow-hidden flex flex-col ${activeTab !== 'reels' ? 'h-[calc(100%-88px)]' : 'h-full'}`}>
        {activeTab === 'reels' && (
          <ReelsView
            foodItems={visibleFoodItems}
            likedIds={likedIds}
            onToggleLike={handleToggleLike}
            onAddToCart={handleAddToCart}
            onOpenPlatformCompare={handleOpenPlatformCompare}
            onOpenRestaurantCompare={handleOpenRestaurantCompare}
            onAskAIAboutDish={handleAskAIAboutDish}
            dietaryFilter={dietaryFilter}
            onSelectDietaryFilter={handleSelectDietaryFilter}
          />
        )}

        {activeTab === 'smart_crave' && (
          <SmartCraveEngine
            foodItems={visibleFoodItems}
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            onAddToCart={handleAddToCart}
            onOpenPlatformCompare={handleOpenPlatformCompare}
            onOpenRestaurantCompare={handleOpenRestaurantCompare}
            onAskAIAboutDish={handleAskAIAboutDish}
          />
        )}

        {activeTab === 'crave_ai' && (
          <CraveAIPage
            foodItems={visibleFoodItems}
            preferences={preferences}
            onAddToCart={handleAddToCart}
            onOpenPlatformCompare={handleOpenPlatformCompare}
          />
        )}

        {activeTab === 'search' && (
          <SearchExploreView
            foodItems={visibleFoodItems}
            dietaryFilter={dietaryFilter}
            onSelectDietaryFilter={handleSelectDietaryFilter}
            onAddToCart={handleAddToCart}
            onOpenPlatformCompare={handleOpenPlatformCompare}
            onOpenRestaurantCompare={handleOpenRestaurantCompare}
            onAskAIAboutDish={handleAskAIAboutDish}
          />
        )}

        {activeTab === 'cart_orders' && (
          <CartOrdersView
            cart={cart}
            orders={orders}
            coins={coins}
            onUpdateCart={(updated) => {
              setCart(updated);
              RoomDB.saveCart(updated);
            }}
            onPlaceOrder={handlePlaceOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
      </div>

      {/* Bottom Jetpack Compose Navigation Bar */}
      <JetpackNavbar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
      />

      {/* Comparison Modals */}
      {activeModal === 'platform_compare' && selectedModalFood && (
        <PlatformCompareModal
          foodItem={selectedModalFood}
          onClose={() => setActiveModal(null)}
          onSelectPlatformAndOrder={handleAddToCart}
        />
      )}

      {activeModal === 'restaurant_compare' && selectedModalFood && (
        <RestaurantCompareModal
          foodItem={selectedModalFood}
          onClose={() => setActiveModal(null)}
        />
      )}
    </AndroidFrame>
  );
}
