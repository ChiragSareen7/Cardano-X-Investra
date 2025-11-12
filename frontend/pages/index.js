import Head from 'next/head';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { 
  Wallet, 
  TrendingUp, 
  Shield, 
  ChevronRight, 
  Users, 
  Brain, 
  CheckCircle,
  AlertTriangle,
  BadgeCheck,
  Lock
} from 'lucide-react';

export default function Home() {
  const [isPending, setIsPending] = useState(false);

  const handleConnectWallet = () => {
    setIsPending(true);
    setTimeout(() => setIsPending(false), 1500);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900 dark:text-white transition-colors duration-300">
      <Head>
        <title>Inverstra - AI-Verified Investment Strategies</title>
        <meta name="description" content="Explore, verify and follow financial strategies from curated Web3 communities using AI + blockchain transparency." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-[70vh] flex items-center justify-center 
  bg-gray-50 dark:bg-gradient-to-r dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 py-24 md:py-32">
  <div className="absolute inset-0 animate-gradient-move opacity-30 pointer-events-none">
    <div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 blur-3xl"></div>
    <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 blur-3xl"></div>
    <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
  </div>
  <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
    <span className="inline-block mb-6 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-xs font-semibold shadow-md">
      🚀 Built for HackIndia 2025
    </span>
    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-slate-900 dark:text-white">
      Invest smarter with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">AI-verified tips</span> & trusted communities
    </h1>
    <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
      Explore, verify, and follow financial strategies from curated Web3 communities using AI + blockchain transparency.
    </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/wallet-connect">
                <Button 
                  onClick={handleConnectWallet} 
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white rounded-full text-lg py-6 px-8 font-semibold shadow-lg"
                  disabled={isPending}
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  {isPending ? "Connecting..." : "Connect Wallet"}
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" className="border-pink-400 text-pink-500 dark:text-pink-400 dark:border-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950 rounded-full text-lg py-6 px-8 font-semibold">
                  Learn More
                </Button>
              </a>
            </div>
          </div>
        </section>

       {/* Problem Section with Radial Stats */}
<section className="bg-slate-50 dark:bg-slate-900 py-20 transition-colors duration-300">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-slate-900 dark:text-white">
      The <span className="text-red-500 dark:text-red-400">Problem</span> With Investment Advice Today
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
      {/* Item 1 */}
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64" cy="64" r="60"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-200 dark:text-slate-700"
              fill="none"
            />
            <circle
              cx="64" cy="64" r="60"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray="377"
              strokeDashoffset="68"
              className="text-red-500 dark:text-red-400 transition-all duration-700"
              fill="none"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-slate-900 dark:text-white">
            82%
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
          Unverifiable Advice
        </h3>
        <p className="text-slate-600 dark:text-slate-300 max-w-xs">
          New investors can’t verify if financial advice online is trustworthy.
        </p>
      </div>

      {/* Item 2 */}
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-700" fill="none" />
            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" strokeDasharray="377" strokeDashoffset="120" className="text-yellow-500 dark:text-yellow-400 transition-all duration-700" fill="none" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-slate-900 dark:text-white">
            ₹700Cr+
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
          Scam Losses
        </h3>
        <p className="text-slate-600 dark:text-slate-300 max-w-xs">
          Amount lost to investment scams in 2023 alone.
        </p>
      </div>

      {/* Item 3 */}
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-700" fill="none" />
            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" strokeDasharray="377" strokeDashoffset="34" className="text-purple-500 dark:text-purple-400 transition-all duration-700" fill="none" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-slate-900 dark:text-white">
            91%
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
          Misleading Hype
        </h3>
        <p className="text-slate-600 dark:text-slate-300 max-w-xs">
          Social media is filled with misleading financial hype.
        </p>
      </div>
    </div>
  </div>
</section>



        {/* Solution Snapshot */}
        <section className="bg-white dark:bg-slate-950 py-20 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-slate-900 dark:text-white">
              Our <span className="text-green-500 dark:text-green-400">Solution</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <Card className="bg-slate-50 dark:bg-slate-900 border-0 shadow-xl shadow-blue-500/5 hover:shadow-blue-500/10 transition">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mb-6">
                    <Shield className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">AI Risk Analyzer</h3>
                  <p className="text-slate-600 dark:text-slate-500">
                    Quickly see if an investment tip is high-risk, medium or safe with our advanced AI analysis
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-50 dark:bg-slate-900 border-0 shadow-xl shadow-purple-500/5 hover:shadow-purple-500/10 transition">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8 text-purple-500 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Web3 Trust</h3>
                  <p className="text-slate-600 dark:text-slate-500">
                    Only verified communities can publish tips, with all actions transparently stored on-chain
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-50 dark:bg-slate-900 border-0 shadow-xl shadow-green-500/5 hover:shadow-green-500/10 transition">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center mb-6">
                    <TrendingUp className="w-8 h-8 text-green-500 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Performance History</h3>
                  <p className="text-slate-600 dark:text-slate-500">
                    Tips and communities earn reputation based on past accuracy, building trust over time
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="bg-slate-100 dark:bg-slate-900 py-20 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-slate-900 dark:text-white">
              How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-500">Works</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center relative shadow-md dark:shadow-lg">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-xl font-bold text-white">1</div>
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mb-6">
                  <Wallet className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Connect Wallet</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Securely connect your Web3 wallet to access the platform
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center relative shadow-md dark:shadow-lg">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-xl font-bold text-white">2</div>
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Join Communities</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Find and join investment communities that match your interests
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center relative shadow-md dark:shadow-lg">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-xl font-bold text-white">3</div>
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Discover & Invest</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Browse AI-verified tips and invest with confidence
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Communities + Tips Preview */}
        <section id="communities" className="bg-white dark:bg-slate-950 py-20 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-slate-900 dark:text-white">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-500">Communities & Tips</span>
            </h2>
            <p className="text-xl text-center text-slate-600 dark:text-slate-300 mb-16 max-w-3xl mx-auto">
              Explore AI-verified investment tips from our trusted communities
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="bg-slate-50 dark:bg-slate-900 border-0 shadow-xl hover:shadow-md transition">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Badge className="bg-green-100 text-green-700 border-green-300 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/50">Low Risk</Badge>
                    </div>
                    <div className="flex items-center">
                      <BadgeCheck className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-1" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">Verified</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Long-term ETF in Green Energy Tech</h3>
                  <p className="text-slate-600 dark:text-slate-500 text-sm mb-4">
                    Clean energy ETFs show promising long-term growth with reduced volatility...
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <span className="truncate">0x71a2...3e5f</span>
                    </div>
                    <div className="flex items-center text-sm text-blue-500 dark:text-blue-300">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>426 upvotes</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white">
                    View Details
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-50 dark:bg-slate-900 border-0 shadow-xl hover:shadow-md transition">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/50">Medium Risk</Badge>
                    </div>
                    <div className="flex items-center">
                      <BadgeCheck className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-1" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">Verified</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Mid-cap Tech Stock Analysis</h3>
                  <p className="text-slate-600 dark:text-slate-500 text-sm mb-4">
                    Undervalued mid-cap technology stocks showing strong fundamentals...
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <span className="truncate">TechAnalysts</span>
                    </div>
                    <div className="flex items-center text-sm text-blue-500 dark:text-blue-300">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>183 upvotes</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white">
                    View Details
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-50 dark:bg-slate-900 border-0 shadow-xl hover:shadow-md transition">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Badge className="bg-red-100 text-red-700 border-red-300 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/50">High Risk</Badge>
                    </div>
                    <div className="flex items-center">
                      <BadgeCheck className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-1" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">Verified</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Emerging Market DeFi Opportunity</h3>
                  <p className="text-slate-600 dark:text-slate-500 text-sm mb-4">
                    Emerging DeFi protocols showing significant growth potential but higher risk...
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <span className="truncate">DeFi Wolves</span>
                    </div>
                    <div className="flex items-center text-sm text-blue-500 dark:text-blue-300">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>91 upvotes</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

{/* Who It's For Section */}
<section id="who-its-for" className="py-20 bg-gradient-to-b from-white via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-4xl font-bold text-center mb-16">
      Who It’s <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">For</span>
    </h2>

    <div className="relative border-l-4 border-purple-300 dark:border-purple-500 ml-6">
      {/* Learners */}
      <div className="mb-12 ml-6 relative">
        <div className="absolute -left-10 top-2 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
          <span className="text-blue-500 dark:text-blue-300 text-lg">👥</span>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Learners</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          New to investing? Start with trusted communities and learn from verified experts with proven track records.
        </p>
        <button className="mt-4 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-300 to-blue-400 text-gray-900 font-medium hover:from-blue-400 hover:to-blue-500 dark:from-blue-600 dark:to-blue-700 dark:text-white transition">
          Get Started →
        </button>
      </div>

      {/* Influencers */}
      <div className="mb-12 ml-6 relative">
        <div className="absolute -left-10 top-2 w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-800 flex items-center justify-center">
          <span className="text-pink-500 dark:text-pink-300 text-lg">📈</span>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Influencers</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Share your strategies, build reputation, and earn rewards as your investment advice helps others succeed.
        </p>
        <button className="mt-4 px-5 py-2 rounded-lg bg-gradient-to-r from-pink-300 to-purple-300 text-gray-900 font-medium hover:from-pink-400 hover:to-purple-400 dark:from-pink-600 dark:to-purple-600 dark:text-white transition">
          Start Building →
        </button>
      </div>

      {/* Analysts */}
      <div className="ml-6 relative">
        <div className="absolute -left-10 top-2 w-8 h-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
          <span className="text-green-500 dark:text-green-300 text-lg">🧠</span>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Analysts</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Run risk analysis and earn from good advice. Use your expertise to help others make informed decisions.
        </p>
        <button className="mt-4 px-5 py-2 rounded-lg bg-gradient-to-r from-green-300 to-teal-300 text-gray-900 font-medium hover:from-green-400 hover:to-teal-400 dark:from-green-600 dark:to-teal-600 dark:text-white transition">
          Apply Now →
        </button>
      </div>
    </div>
  </div>
</section>



        {/* AI + Web3 Edge */}
        <section className="bg-white dark:bg-slate-950 py-20 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-slate-900 dark:text-white">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-500">AI + Web3 Edge</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-slate-50 dark:bg-slate-900 border-0 shadow-xl">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mb-6">
                    <Brain className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">AI Risk Analysis</h3>
                  <p className="text-slate-600 dark:text-slate-500">
                    Every investment tip is AI-evaluated for risk factors, market conditions, and potential returns.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-50 dark:bg-slate-900 border-0 shadow-xl">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8 text-purple-500 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">On-Chain Transparency</h3>
                  <p className="text-slate-600 dark:text-slate-500">
                    All actions are stored on-chain for full transparency and immutable record-keeping.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-50 dark:bg-slate-900 border-0 shadow-xl">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center mb-6">
                    <Users className="w-8 h-8 text-green-500 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Community Governance</h3>
                  <p className="text-slate-600 dark:text-slate-500">
                    No anonymous spam. Communities govern what gets published through reputation systems.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        {/* <section className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to invest with confidence?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Join Inverstra today and discover AI-verified investment strategies from trusted communities.
            </p>
            <Button 
              onClick={handleConnectWallet} 
              className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-10"
              disabled={isPending}
            >
              <Wallet className="w-5 h-5 mr-2" />
              {isPending ? "Connecting..." : "Connect Wallet"}
            </Button>
          </div>
        </section> */}

        {/* Tech Stack / Trust Badges */}
        {/* <section className="bg-slate-950 py-16">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-lg font-medium mb-8 text-slate-400">
              Powered By Cutting-Edge Technologies
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-50 max-w-4xl mx-auto">
              <div className="h-8">
                <span className="text-xl font-semibold">Ethers.js</span>
              </div>
              <div className="h-8">
                <span className="text-xl font-semibold">Next.js</span>
              </div>
              <div className="h-8">
                <span className="text-xl font-semibold">OpenAI</span>
              </div>
              <div className="h-8">
                <span className="text-xl font-semibold">Polygon</span>
              </div>
              <div className="h-8">
                <span className="text-xl font-semibold">Eternl Wallet</span>
              </div>
              <div className="h-8">
                <span className="text-xl font-semibold">shadcn/ui</span>
              </div>
            </div>

            <div className="mt-10">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 py-1 px-4 text-base">
                Built for HackIndia 2025
              </Badge> 
            </div>
          </div>
        </section> */}
      </main>

      <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-500">
                Inverstra
              </span>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                AI-Verified Investment Strategies
              </p>
            </div>
            <div className="flex flex-wrap gap-8 mb-6 md:mb-0">
              <a href="#" className="text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400">About</a>
              <a href="#" className="text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400">Contact</a>
              <a href="https://github.com/kamakship18/HackIndia25_Maverick/tree/main/components/ui" className="text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400">GitHub</a>
            </div>
            <div className="flex space-x-4">
              {/* Facebook Icon */}
              <a href="#" className="text-slate-400 hover:text-blue-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              {/* Instagram Icon */}
              <a href="#" className="text-slate-400 hover:text-blue-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.66.25 1.22.598 1.772 1.153.556.555.905 1.113 1.152 1.772.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772c-.554.555-1.112.904-1.772 1.152-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153c-.555-.554-.904-1.112-1.152-1.772-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              {/* Twitter/X Icon */}
              <a href="#" className="text-slate-400 hover:text-blue-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              {/* GitHub Icon */}
              <a href="#" className="text-slate-400 hover:text-blue-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm">
            © 2025 Inverstra. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}