import { aj } from "../config/arcjet.js"

export const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // Fixed typo: was "requrested"
      // Add fingerprint to help with legitimate user identification
      fingerprint: req.ip || req.connection.remoteAddress
    })

    // Handle denied requests
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: "Too Many Requests",
          message: "Rate limit exceeded. Please try again later."
        });
      }
      else if (decision.reason.isBot()) {
        // More lenient bot handling - only block if it's definitely malicious
        console.log("Bot detected:", {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          reason: decision.reason
        });
        
        // Allow legitimate bots but block suspicious ones
        if (decision.reason.isSpoofed() || decision.reason.category === 'MALICIOUS') {
          return res.status(403).json({
            error: "Bot access denied",
            message: "Automated requests are not allowed."
          });
        }
        // For other bots, you might want to log but allow
        console.log("Allowing bot request from:", req.ip);
      }
      else {
        return res.status(403).json({
          error: "Forbidden",
          message: "Access denied by security policy."
        });
      }
    }

    // Check for spoofed bots (this might be redundant with the above check)
    const spoofedBot = decision.results.find((result) => 
      result.reason.isBot() && result.reason.isSpoofed()
    );
    
    if (spoofedBot) {
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected."
      });
    }
    console.log("Arcjet Middleware passed!")

    // Request is allowed, continue to next middleware
    next();
    
  } catch (error) {
    console.error("Arcjet middleware error:", error);
    // Allow request to continue if Arcjet fails (fallback)
    next();
  }
}