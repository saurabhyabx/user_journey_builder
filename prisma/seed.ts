import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing questions
  await prisma.interviewQuestion.deleteMany({});

  // ==================================
  // PAGE 1: PRODUCT_IDENTITY
  // ==================================
  await prisma.interviewQuestion.createMany({
    data: [
      {
        category: "PRODUCT_IDENTITY",
        order: 1,
        question: "What type of product are you building?",
        inputType: "SELECT",
        options: [
          { value: "saas", label: "SaaS Web App" },
          { value: "mobile", label: "Mobile App" },
          { value: "ecommerce", label: "E-commerce Store" },
          { value: "marketplace", label: "Marketplace/Platform" },
          { value: "api", label: "API/Developer Tool" },
          { value: "other", label: "Other" },
        ],
        required: true,
      },
      {
        category: "PRODUCT_IDENTITY",
        order: 2,
        question: "Describe your product in one sentence",
        inputType: "TEXT",
        placeholder: "e.g., A platform that helps designers create prototypes faster",
        required: true,
        helpText: "Keep it clear and concise - this helps AI understand your core value proposition",
      },
      {
        category: "PRODUCT_IDENTITY",
        order: 3,
        question: "What problem does it solve?",
        inputType: "TEXTAREA",
        placeholder: "Describe the main pain point your product addresses...",
        required: true,
        helpText: "Be specific about the problem - this shapes the entire journey",
      },
    ],
  });

  // ==================================
  // PAGE 2: TARGET_USERS
  // ==================================
  await prisma.interviewQuestion.createMany({
    data: [
      {
        category: "TARGET_USERS",
        order: 1,
        question: "Who is your primary user?",
        inputType: "SELECT",
        options: [
          { value: "individual", label: "Individual Consumer" },
          { value: "small_business", label: "Small Business Owner" },
          { value: "enterprise", label: "Enterprise/Corporate" },
          { value: "developer", label: "Developer/Technical User" },
          { value: "creator", label: "Creator/Content Producer" },
          { value: "student", label: "Student/Educator" },
        ],
        required: true,
      },
      {
        category: "TARGET_USERS",
        order: 2,
        question: "What's their experience level with similar products?",
        inputType: "SELECT",
        options: [
          { value: "beginner", label: "Beginner - Never used anything like this" },
          { value: "intermediate", label: "Intermediate - Used similar tools before" },
          { value: "expert", label: "Expert - Power user of competitors" },
          { value: "mixed", label: "Mixed - Wide range of experience levels" },
        ],
        required: true,
      },
      {
        category: "TARGET_USERS",
        order: 3,
        question: "What's their biggest pain point before using your product?",
        inputType: "TEXTAREA",
        placeholder: "e.g., They spend 5 hours a week manually doing this task...",
        required: true,
      },
    ],
  });

  // ==================================
  // PAGE 3: USER_ACQUISITION
  // ==================================
  await prisma.interviewQuestion.createMany({
    data: [
      {
        category: "USER_ACQUISITION",
        order: 1,
        question: "How do users discover you?",
        inputType: "MULTI_SELECT",
        options: [
          { value: "google", label: "Google Search" },
          { value: "social", label: "Social Media (Twitter, LinkedIn, etc.)" },
          { value: "word_of_mouth", label: "Word of Mouth / Referrals" },
          { value: "paid_ads", label: "Paid Advertising" },
          { value: "content", label: "Content Marketing / Blog" },
          { value: "product_hunt", label: "Product Hunt / Directories" },
          { value: "partnerships", label: "Partnerships / Integrations" },
        ],
        required: true,
      },
      {
        category: "USER_ACQUISITION",
        order: 2,
        question: "What's the first action after landing?",
        inputType: "SELECT",
        options: [
          { value: "signup", label: "Sign up immediately" },
          { value: "explore", label: "Explore features/pricing first" },
          { value: "demo", label: "Try demo or free trial" },
          { value: "talk_sales", label: "Book a call with sales" },
          { value: "watch_video", label: "Watch demo video" },
        ],
        required: true,
      },
      {
        category: "USER_ACQUISITION",
        order: 3,
        question: "What info do you collect at signup?",
        inputType: "MULTI_SELECT",
        options: [
          { value: "email", label: "Email" },
          { value: "name", label: "Name" },
          { value: "phone", label: "Phone Number" },
          { value: "company", label: "Company Name" },
          { value: "use_case", label: "Use Case / Role" },
          { value: "team_size", label: "Team Size" },
          { value: "social", label: "Social Login (Google, GitHub, etc.)" },
        ],
        required: true,
      },
    ],
  });

  // ==================================
  // PAGE 4: CORE_EXPERIENCE
  // ==================================
  await prisma.interviewQuestion.createMany({
    data: [
      {
        category: "CORE_EXPERIENCE",
        order: 1,
        question: "What's THE main action users take in your product?",
        inputType: "TEXT",
        placeholder: "e.g., Create a new project, Upload a file, Send a message",
        required: true,
        helpText: "The single most important thing users do repeatedly",
      },
      {
        category: "CORE_EXPERIENCE",
        order: 2,
        question: "How often do they use it?",
        inputType: "SELECT",
        options: [
          { value: "daily", label: "Daily - Multiple times per day" },
          { value: "weekly", label: "Weekly - Few times a week" },
          { value: "monthly", label: "Monthly - Once or twice a month" },
          { value: "as_needed", label: "As Needed - Sporadic usage" },
        ],
        required: true,
      },
      {
        category: "CORE_EXPERIENCE",
        order: 3,
        question: "What makes them come back?",
        inputType: "MULTI_SELECT",
        options: [
          { value: "new_content", label: "New Content / Updates" },
          { value: "notifications", label: "Email/Push Notifications" },
          { value: "habit", label: "Habit / Daily Routine" },
          { value: "collaboration", label: "Team Collaboration" },
          { value: "need_based", label: "When They Have a Specific Need" },
          { value: "progress", label: "Tracking Progress / Goals" },
        ],
        required: true,
      },
    ],
  });

  // ==================================
  // PAGE 5: MONETIZATION
  // ==================================
  await prisma.interviewQuestion.createMany({
    data: [
      {
        category: "MONETIZATION",
        order: 1,
        question: "How do you make money?",
        inputType: "SELECT",
        options: [
          { value: "free", label: "Free Forever" },
          { value: "freemium", label: "Freemium (Free + Paid Plans)" },
          { value: "free_trial", label: "Free Trial → Paid Subscription" },
          { value: "paid_only", label: "Paid Only (No Free Tier)" },
          { value: "usage_based", label: "Usage-Based Pricing" },
          { value: "one_time", label: "One-Time Purchase" },
        ],
        required: true,
      },
      {
        category: "MONETIZATION",
        order: 2,
        question: "What triggers an upgrade decision?",
        inputType: "SELECT",
        options: [
          { value: "hit_limits", label: "Hit Free Tier Limits" },
          { value: "need_features", label: "Need Pro Features" },
          { value: "team_growth", label: "Team Grows (Add Members)" },
          { value: "trial_ends", label: "Free Trial Ends" },
          { value: "success", label: "After Getting Value/Success" },
        ],
        required: true,
      },
      {
        category: "MONETIZATION",
        order: 3,
        question: "What's your price range?",
        inputType: "SELECT",
        options: [
          { value: "under_10", label: "< $10/month" },
          { value: "10_to_50", label: "$10-50/month" },
          { value: "50_to_200", label: "$50-200/month" },
          { value: "over_200", label: "$200+/month" },
          { value: "one_time", label: "One-Time Payment" },
          { value: "custom", label: "Custom Enterprise Pricing" },
        ],
        required: true,
      },
    ],
  });

  // ==================================
  // PAGE 6: RETENTION_GROWTH
  // ==================================
  await prisma.interviewQuestion.createMany({
    data: [
      {
        category: "RETENTION_GROWTH",
        order: 1,
        question: "What does 'success' look like for your user?",
        inputType: "TEXTAREA",
        placeholder: "e.g., They've created 10 projects and saved 20 hours of work...",
        required: true,
      },
      {
        category: "RETENTION_GROWTH",
        order: 2,
        question: "How do happy users help you grow?",
        inputType: "MULTI_SELECT",
        options: [
          { value: "referrals", label: "Direct Referrals / Invites" },
          { value: "reviews", label: "Reviews / Testimonials" },
          { value: "case_studies", label: "Case Studies / Success Stories" },
          { value: "social_sharing", label: "Social Media Sharing" },
          { value: "community", label: "Active in Community / Forums" },
          { value: "word_of_mouth", label: "Organic Word of Mouth" },
        ],
        required: true,
      },
      {
        category: "RETENTION_GROWTH",
        order: 3,
        question: "What would make a user leave?",
        inputType: "MULTI_SELECT",
        options: [
          { value: "found_alternative", label: "Found Better Alternative" },
          { value: "too_complex", label: "Too Complex / Hard to Use" },
          { value: "too_expensive", label: "Too Expensive" },
          { value: "no_need", label: "No Longer Need It" },
          { value: "poor_support", label: "Poor Customer Support" },
          { value: "missing_features", label: "Missing Key Features" },
        ],
        required: true,
      },
    ],
  });

  console.log("✅ Seeded 18 interview questions across 6 categories");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
