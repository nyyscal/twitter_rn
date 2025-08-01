import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node"
import { ENV } from "./env.js"

export const aj = arcjet({
  key: ENV.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    // Shield protects your app from common attacks eg: SQL injection, XSS, CSRF attacks
    shield({ mode: "LIVE" }),

    // Bot detection - more permissive to avoid blocking legitimate users
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc.
        "CATEGORY:PREVIEW",       // Social media previews (Twitter, Facebook, etc.)
        "CATEGORY:MONITOR"        // Uptime monitors
      ]
    }),

    // Rate limiting with token bucket algo
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,    // tokens added per interval
      interval: 60,      // Changed to 60 seconds (10 seconds is very short)
      capacity: 50,      // Increased capacity for better user experience
    })
  ]
});