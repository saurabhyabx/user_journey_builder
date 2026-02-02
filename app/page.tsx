import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            Journey Builder
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm font-medium hover:text-primary">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm font-medium hover:text-primary">
              Docs
            </Link>
            <Link href="/new-journey">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              What if an <span className="text-primary">AI UX Strategist</span> helped you think through your entire user journey?
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Stop guessing. Let our AI partner challenge your assumptions, find the gaps in your flow,
              and visualize your product&apos;s true potential in real-time.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/new-journey">
                <Button size="lg" className="text-lg px-8 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all">
                  Start Thinking & Mapping
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="ghost" className="text-lg">
                  See how it works
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="border-t bg-muted/50 py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Why Journey Builder?</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                title="🤖 AI Interview"
                description="Answer smart questions about your product. AI understands your intent and captures 80% of the info needed."
              />
              <FeatureCard
                title="🎨 Visual Editor"
                description="Drag-and-drop node-based interface powered by ReactFlow. Edit, customize, and refine your journey."
              />
              <FeatureCard
                title="💡 Smart Insights"
                description="AI suggests intervention points, identifies bottlenecks, and optimizes conversion paths."
              />
              <FeatureCard
                title="📊 Export Anywhere"
                description="Download as Mermaid diagrams, PNG/SVG images, or interactive prototypes."
              />
              <FeatureCard
                title="💬 Collaborate"
                description="Comment on any node, get AI feedback, and iterate with your team in real-time."
              />
              <FeatureCard
                title="🚀 Fast & Simple"
                description="Generate complete user journeys in minutes, not days. From idea to visualization instantly."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-12 text-center">
            <h2 className="text-3xl font-bold">Ready to visualize your product?</h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of product builders mapping their user journeys with AI.
            </p>
            <div className="mt-8">
              <Link href="/new-journey">
                <Button size="lg" className="text-lg">
                  Get Started - It's Free
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Free tier: 5 journeys • No credit card required
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 Journey Builder. Built with Next.js, ReactFlow, and AI.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
