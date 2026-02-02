import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function DemoPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500/30">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Journey.AI
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Link href="/new-journey">
                            <Button className="bg-blue-600 hover:bg-blue-500 text-white border-0">
                                Start Building
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Live Demo Experience
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        See How The Meta Journey Works
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                        From raw idea to strategic blueprint in minutes. Watch the infographic below to understand our core engine.
                    </p>
                </div>
            </div>

            {/* Infographic Section */}
            <div className="container mx-auto px-4 pb-32">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900/50 backdrop-blur max-w-5xl mx-auto animate-in fade-in scale-in-95 duration-1000 delay-300">
                    {/* Glow effects */}
                    <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-[128px] pointer-events-none"></div>
                    <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-[128px] pointer-events-none"></div>

                    <div className="p-8 md:p-12 text-center">
                        <h2 className="text-2xl font-semibold mb-8">The Strategy Engine</h2>

                        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border border-white/5 shadow-inner bg-slate-950 group">
                            <Image
                                src="/images/meta-journey-infographic.png"
                                alt="Meta Journey Infographic"
                                fill
                                className="object-contain hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 bg-black/20">
                        <div className="p-8 text-center group hover:bg-white/5 transition-colors">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/20 transition-colors">
                                <span className="text-2xl">💬</span>
                            </div>
                            <h3 className="font-bold text-white mb-2">1. AI Discovery</h3>
                            <p className="text-sm text-slate-400">Our AI Strategist interviews you to uncover hidden constraints and value propositions.</p>
                        </div>
                        <div className="p-8 text-center group hover:bg-white/5 transition-colors">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/20 transition-colors">
                                <span className="text-2xl">⚡</span>
                            </div>
                            <h3 className="font-bold text-white mb-2">2. Live Visualization</h3>
                            <p className="text-sm text-slate-400">Watch your user journey diagram build itself in real-time as you speak.</p>
                        </div>
                        <div className="p-8 text-center group hover:bg-white/5 transition-colors">
                            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/20 transition-colors">
                                <span className="text-2xl">📈</span>
                            </div>
                            <h3 className="font-bold text-white mb-2">3. Strategic Insight</h3>
                            <p className="text-sm text-slate-400">Identify gaps, opportunities, and &quot;Aha!&quot; moments automatically.</p>
                        </div>
                    </div>

                    <div className="p-8 text-center border-t border-white/10">
                        <Link href="/new-journey">
                            <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-200 font-semibold px-8 h-12 rounded-full">
                                Experience It Live <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
