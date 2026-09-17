import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side Gemini AI initialization
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instruction for CraveBite Food Intelligence & Platform Deal Compare
const FOOD_AI_SYSTEM_INSTRUCTION = `You are CraveBite's AI Food Intelligence & Deal Comparator Engine.
You analyze food dishes, restaurant culinary reputations, bestsellers vs budget-friendly gems, and compare delivery platform deals (Swiggy, Zomato, EatSure, Magicpin, Direct).

Your tone is energetic, foodie-savvy, sharp, and helpful.

When responding to queries:
1. Provide a direct, mouth-watering verdict on the best options.
2. Compare where to order (e.g. Swiggy coupon discounts vs Zomato Gold perks vs EatSure combo deals vs Magicpin vouchers vs Direct ordering).
3. Distinguish between 'Famous Bestsellers' (premium reputation) and 'Budget Taste Champions' (cheap rate, exceptional taste).
4. Point out which specific restaurant in the local scene excels at that dish and why (e.g. secret spice blend, authentic clay oven, slow dum cooking).
5. Give realistic price estimates (in INR ₹ and USD $ equivalent), discount codes, and estimated prep/delivery times.
6. Provide structured bullet points with clear bold headers, emojis, and a summary comparison recommendation.`;

// API endpoint for AI Food Intelligence & Deal Comparator
app.post("/api/gemini/food-compare", async (req, res) => {
  try {
    const { prompt, userPreferences, currentFoodContext } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "A valid text prompt is required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Graceful fallback if no API key is set yet
      return res.json({
        text: `### 🍔 CraveBite Food Intelligence Analysis\n\n**Query:** "${prompt}"\n\n#### 🏆 Best Overall Pick\n* **Paradise Dum Biryani** (Rating: 4.8★) — Authentic saffron dum aroma with tender long-grain basmati.\n\n#### 🏷️ Platform Offer Comparison\n* **Swiggy:** ₹280 (Use code \`SWIGGYIT\` for ₹80 off + Free Delivery on Swiggy One) 🥇 *Cheapest Pick*\n* **Zomato:** ₹310 (Use code \`ZOMATO50\` for 50% up to ₹100)\n* **EatSure:** ₹329 (Complimentary Gulab Jamun combo)\n* **Direct:** ₹340 (Standard menu price)\n\n#### 💡 AI Pro-Tip:\nIf ordering between 2 PM - 6 PM, Swiggy gives extra lightning deals! For late night after 11 PM, Zomato has faster 22-min delivery nearby.`,
        suggestedDishName: "Hyderabadi Dum Biryani",
        recommendedPlatform: "Swiggy",
      });
    }

    let contextualPrompt = prompt;
    if (userPreferences) {
      contextualPrompt += `\n\n[User Context: Mood=${userPreferences.mood || "Any"}, Craving=${userPreferences.craving || "Any"}, Budget=${userPreferences.budget || "Any"}, VegOnly=${userPreferences.vegOnly ? "Yes" : "No"}]`;
    }
    if (currentFoodContext) {
      contextualPrompt += `\n\n[Currently Viewed Dish: ${currentFoodContext.name} from ${currentFoodContext.restaurant}, Base Price: ₹${currentFoodContext.price}]`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: contextualPrompt,
      config: {
        systemInstruction: FOOD_AI_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const responseText = response.text || "Unable to generate comparison. Please try again.";
    res.json({ text: responseText });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      error: "Failed to query AI Food Intelligence",
      details: error?.message || "Unknown error",
    });
  }
});

// API health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "CraveBite", version: "1.0.0" });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CraveBite Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
