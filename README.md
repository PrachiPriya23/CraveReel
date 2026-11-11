<div align="center">

# 🍔 CraveReels – Swipe. Crave. Order.
**AI-Powered Food Discovery & Price Comparison Application**

<img src="https://github.com/user-attachments/assets/f136ea92-723a-4502-a3f6-acdf40f3d232" width="180" alt="CraveReels Screenshot 1"/> <img src="https://github.com/user-attachments/assets/1c3cd456-91fe-44a2-9a78-fca86cfbeace" width="180" alt="CraveReels Screenshot 2"/> <img src="https://github.com/user-attachments/assets/50061034-90e5-4878-a05c-3776e51d1799" width="180" alt="CraveReels Screenshot 3"/> <img src="https://github.com/user-attachments/assets/e28f45f0-88ba-4629-a6af-bfac6e302907" width="180" alt="CraveReels Screenshot 4"/> <img src="https://github.com/user-attachments/assets/433626f1-291f-4dd0-b7c7-23a2e0ba6384" width="180" alt="CraveReels Screenshot 5"/>

</div>


## 🎬 CraveReel App Demo

https://github.com/user-attachments/assets/dd49212d-3725-4108-9561-f04fba27ac54

## 🚀 Project Overview
CraveReels is an AI-powered food discovery and price comparison application designed to make food ordering smarter, faster, and more affordable. It combines short-form food reels, AI-powered food recommendations, and multi-platform price comparison to help users discover their favourite meals and find the best available deals. Instead of switching between multiple food delivery applications, users can explore food, compare prices, discover discounts, and make smarter ordering decisions in one place.

## ✨ Key Features
**1. Food Reels**
- Vertical scrolling food video feed.
- Discover trending dishes and popular food items.
- Like, save, and share food content.
- View food details, descriptions, and prices.
- Add favourite dishes to the cart.

**2. Crave AI – AI Food Assistant**
- AI-powered food recommendations using Google Gemini.
- Get suggestions based on mood and preferences.
- Discover meals according to budget.
- Vegetarian and non-vegetarian recommendations.
- Healthy food suggestions.
- Interactive AI chatbot.

**3. Smart Price Comparison**
- Compare food prices across Swiggy, Zomato, and other supported platforms.
- Compare original food prices and discount percentages.
- Check coupon offers and delivery charges.
- Compare platform fees and taxes.
- Calculate final payable amounts.
- Identify the lowest final price and best available deal.

**4. Explore Food**
- Search for food and restaurants.
- Browse different food categories.
- Discover popular dishes and cuisines.
- Get personalized recommendations.

**5. Cart & Order Management**
- Add and remove food items.
- Increase or decrease quantities.
- Calculate total amounts.
- View available discounts.
- Access order tracking functionality.

**6. Mobile-Friendly Experience**
- Responsive mobile-first interface.
- Modern dark-themed UI.
- Smooth navigation and scrolling.
- Touch-friendly interactions.
- PWA installation support where configured.

## 🛠️ Technology Stack
| Technology | Purpose |
|---|---|
| React.js | Frontend Development |
| TypeScript | Type-Safe Development |
| Tailwind CSS | UI Design and Styling |
| Google Gemini API | AI Food Assistant |
| JavaScript | Application Functionality |
| Local Storage / Database | Data Persistence |
| PWA | Mobile Installation Support |

## 📁 Project Structure
```text
CraveReels/
├── public/
│   ├── images/
│   ├── icons/
│   └── videos/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── videos/
│   │   └── icons/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── BottomNavigation.tsx
│   │   ├── FoodCard.tsx
│   │   ├── ReelCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── PriceComparisonCard.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Reels.tsx
│   │   ├── Explore.tsx
│   │   ├── CraveAI.tsx
│   │   ├── PriceComparison.tsx
│   │   ├── Cart.tsx
│   │   └── OrderTracking.tsx
│   ├── services/
│   │   ├── geminiService.ts
│   │   ├── foodService.ts
│   │   └── comparisonService.ts
│   ├── hooks/
│   │   ├── useCart.ts
│   │   └── useFoodRecommendations.ts
│   ├── context/
│   │   └── AppContext.tsx
│   ├── data/
│   │   ├── foodData.ts
│   │   └── restaurantData.ts
│   ├── utils/
│   │   └── priceCalculator.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```


## 🤖 AI Integration – Crave AI
CraveReels uses Google Gemini to provide intelligent food recommendations and conversational assistance. Users can ask questions such as:
- What should I eat under ₹150?
- Suggest a healthy dinner.
- I am craving something spicy.
- Recommend the best vegetarian meal.
- Which food gives me the best value for money?
- Suggest something for late-night cravings.

The AI assistant helps users discover suitable meals based on their preferences and budget.

## 💰 Price Comparison – Core Innovation
One of the main objectives of CraveReels is to help users save money while ordering food. The application compares food prices and available offers across supported delivery platforms.

**Illustrative Price Comparison**

| Details | Swiggy | Zomato |
|---|---:|---:|
| Food Price | ₹250 | ₹250 |
| Discount | ₹50 | ₹30 |
| Delivery Fee | ₹25 | ₹20 |
| Platform Fee | ₹6 | ₹6 |
| Taxes | ₹12 | ₹12 |
| **Final Amount** | **₹243** | **₹258** |

In this illustrative example, Swiggy provides the lower final payable amount after considering all additional charges. Actual prices, discounts, taxes, and fees vary by location, restaurant, and time. Real-time comparison requires authorized data integrations.

## 🎯 Project Objectives
1. To develop an intelligent food discovery platform.
2. To integrate AI-powered food recommendations.
3. To simplify food price comparison across delivery platforms.
4. To help users identify better discounts and affordable meals.
5. To improve the overall food discovery and ordering experience.
6. To reduce the time spent switching between food delivery applications.

## 🔮 Future Scope
- Real-time food price comparison through authorized integrations.
- Advanced AI-powered personalized recommendations.
- Restaurant partnerships.
- Secure online payment integration.
- Live order tracking.
- User profiles and food preferences.
- Location-based restaurant recommendations.
- AI-based budget planning.
- Personalized food reels.

## 🌟 Why CraveReels?
Traditional food delivery applications primarily focus on ordering food. CraveReels focuses on three important things: **Discover → Compare → Order**. It combines entertainment, artificial intelligence, and smart savings to create a better food-ordering experience.

## 👩‍💻 Project Information
| Details | Information |
|---|---|
| Project Name | CraveReels |
| Category | AI-Powered Food Discovery & Price Comparison |
| Tagline | Swipe. Crave. Order. |
| AI Technology | Google Gemini |
| Main Purpose | Smart Food Discovery and Affordable Ordering |



<div align="center">

**CraveReels – Swipe. Crave. Order. 🍕**

**Discover More. Compare Better. Save Smarter.**


## 📄 Project Documentation

| Document | Download |
|---|---|
| MAD Review - 1 | [View PDF](./MAD%20Review%20-1.pdf) |
| MAD Review - 2 | [View PDF](./MAD%20Review%20-2.pdf) |




