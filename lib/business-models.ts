
export const BUSINESS_MODELS = {
    freemium: {
        name: "Freemium",
        icon: "🎁",
        description: "Free core features with premium upgrades",
        bestFor: "Broad market products, viral growth potential",
        benefits: [
            "Maximizes user acquisition (no friction)",
            "Natural upgrade funnel as users get value",
            "Community-driven network effects"
        ],
        touchpoints: [
            "Feature limitations tier",
            "Premium onboarding email sequence",
            "In-app upgrade prompts at key moments"
        ],
        conversionPath: "Free User → Active User → Upgraded → Recurring Revenue"
    },
    "free-trial": {
        name: "Free Trial → Paid",
        icon: "⏱️",
        description: "Full access for limited time, then convert",
        bestFor: "SaaS products, B2B tools, high-value solutions",
        benefits: [
            "Builds product habit before charging",
            "Higher conversion rates from trials",
            "Predictable trial-to-paid metrics"
        ],
        touchpoints: [
            "Trial expiration email sequence",
            "Feature usage monitoring",
            "Upgrade CTA before trial ends"
        ],
        conversionPath: "Trial Signup → Feature Discovery → Convert Before Expiry → Renewal"
    },
    "usage-based": {
        name: "Usage-Based Credits",
        icon: "⚡",
        description: "Pay as you go, based on usage",
        bestFor: "APIs, variable-use tools, compute/processing",
        benefits: [
            "Users only pay for what they use",
            "Natural scaling as users grow",
            "No negotiation on pricing"
        ],
        touchpoints: [
            "Usage dashboard visibility",
            "Credit balance warnings",
            "Tiered credit packages",
            "Volume discount offers"
        ],
        conversionPath: "Free Credits → Usage Tracking → Purchase Credits → Recurring Use"
    },
    paywall: {
        name: "Paywall",
        icon: "🔐",
        description: "Full premium access, one-time or subscription",
        bestFor: "Premium content, specialized tools, niche products",
        benefits: [
            "Clear, simple pricing model",
            "Attracts committed customers",
            "High customer LTV"
        ],
        touchpoints: [
            "Limited free access before paywall",
            "Clear value demonstration",
            "Multiple pricing tiers"
        ],
        conversionPath: "Free Sample → Value Discovery → Paywall → Premium Customer"
    },
    marketplace: {
        name: "Marketplace Fees",
        icon: "🏪",
        description: "Earn commission from transactions",
        bestFor: "Transaction platforms, creator economy, P2P services",
        benefits: [
            "Revenue grows with platform value",
            "Two-sided network effects",
            "Aligned incentives with users"
        ],
        touchpoints: [
            "Seller onboarding & verification",
            "Commission structure clarity",
            "Payment settlement flow",
            "Seller analytics dashboard"
        ],
        conversionPath: "User Signup → Sell/Buy First Item → Recurring Transactions → Growth"
    }
};

export function recommendModel(productType: string, userType: string, discoveryChannels: string): keyof typeof BUSINESS_MODELS {
    const type = (productType || "").toLowerCase();
    const user = (userType || "").toLowerCase();
    const channels = (discoveryChannels || "").toLowerCase();

    // SaaS/B2B → Free Trial
    if (type.includes("saas") || type.includes("tool") || user.includes("business") || user.includes("enterprise")) {
        return "free-trial";
    }

    // API/Platform → Usage-Based
    if (type.includes("api") || type.includes("platform") || type.includes("compute") || type.includes("process")) {
        return "usage-based";
    }

    // Marketplace/Transaction → Marketplace
    if (type.includes("market") || type.includes("transaction") || type.includes("creator") || type.includes("p2p")) {
        return "marketplace";
    }

    // Content/Premium → Paywall
    if (type.includes("content") || type.includes("newsletter") || type.includes("premium")) {
        return "paywall";
    }

    // Consumer/Broad → Freemium
    return "freemium";
}
