
import { Link } from 'react-router';
import {
  Bot,
  PlayCircle,
  Zap,
  ArrowRight,
  CheckCircle2,
  Heart,
  BrainCircuit,
  Github,
  Linkedin,
  Mail,
  Globe,
  Mountain
} from 'lucide-react';

const LandingPage = () => {
  
  const trendingProblems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      acceptance: 48.5,
      tags: ["Array", "Hash Table"],
      likes: 1205,
    },
    {
      id: 2,
      title: "Longest Substring",
      difficulty: "Medium",
      acceptance: 34.2,
      tags: ["String", "Sliding Window"],
      likes: 892,
    },
    {
      id: 3,
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      acceptance: 38.1,
      tags: ["Binary Search"],
      likes: 645,
    }
  ];

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Hard': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content font-sans selection:bg-primary/20">
      
      {/* SECTION A: HERO */}
      <section className="relative pt-24 pb-32 lg:pt-40 lg:pb-40 overflow-hidden bg-base-100">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-100 border border-base-300 shadow-sm mb-8 animate-in slide-in-from-bottom-4 fade-in duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-base-content/70">v2.0 is live (2026 Edition)</span>
          </div>

          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter mb-8 text-base-content leading-[0.9]">
            Master the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary/60">
               Code Interview.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-base-content/60 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            The definitive platform for developers to practice algorithms, track progress, and get <span className="text-base-content font-bold underline decoration-primary/30 underline-offset-4">AI-powered mentorship</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/problems" className="btn btn-primary btn-lg h-14 px-8 rounded-full text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
              Start Solving <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
            <Link to="/leaderboard" className="btn btn-ghost btn-lg h-14 px-8 rounded-full text-lg font-bold border border-base-300 hover:bg-base-200">
              View Leaderboard
            </Link>
          </div>

          {/* Minimal Stats */}
          <div className="mt-20 pt-10 border-t border-base-200 max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <div><h4 className="text-3xl font-black text-base-content">500+</h4><p className="text-sm font-medium tracking-wide uppercase">Questions</p></div>
             <div><h4 className="text-3xl font-black text-base-content">10k+</h4><p className="text-sm font-medium tracking-wide uppercase">Users</p></div>
             <div><h4 className="text-3xl font-black text-base-content">24/7</h4><p className="text-sm font-medium tracking-wide uppercase">AI Support</p></div>
          </div>
        </div>
      </section>

      {/* SECTION B: FEATURES */}
      <section className="py-24 bg-base-200/50 border-y border-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
             <h2 className="text-4xl font-bold tracking-tight mb-4">Why CodeClimb?</h2>
             <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
                Built for consistency. Designed for mastery.
             </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             <FeatureCard 
               icon={<Bot className="w-8 h-8 text-blue-600" />}
               title="AI Doubt Solver"
               desc="Stuck? Get personalized hints and complexity analysis from our Gemini-powered coding assistant."
             />
             <FeatureCard 
               icon={<PlayCircle className="w-8 h-8 text-purple-600" />}
               title="Video Solutions"
               desc="Access high-quality video breakdowns for top 150 interview questions."
             />
             <FeatureCard 
               icon={<Zap className="w-8 h-8 text-amber-500" />}
               title="Streak Tracking"
               desc="Gamify your preparation. Build a daily habit and visualize your consistency graph."
             />
          </div>
        </div>
      </section>

      {/* SECTION C: TRENDING */}

      <section className="py-24 bg-base-100 container mx-auto px-4">
         <div className="flex items-end justify-between mb-12">
            <div>
               <h2 className="text-3xl font-bold tracking-tight mb-2">Trending This Week</h2>
               <p className="text-base-content/60">Problems gaining popularity right now.</p>
            </div>
            <Link to="/problems" className="hidden md:flex items-center gap-2 font-bold text-primary hover:underline underline-offset-4">
               View All Problems <ArrowRight size={16} />
            </Link>
         </div>

         <div className="grid md:grid-cols-3 gap-6">
            {trendingProblems.map((p) => (
               <div key={p.id} className="group p-6 rounded-2xl bg-base-100 border border-base-200 shadow-lg shadow-base-200/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                     <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getDifficultyColor(p.difficulty)}`}>
                        {p.difficulty}
                     </span>
                     <span className="flex items-center gap-1 text-xs font-medium text-base-content/40">
                        <Heart size={14} className="fill-current" /> {p.likes}
                     </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  
                  <div className="flex gap-2 mb-6">
                     {p.tags.map(t => (
                        <span key={t} className="text-xs font-mono bg-base-200 px-2 py-1 rounded text-base-content/60 border border-base-300">
                           {t}
                        </span>
                     ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-base-200">
                     <div className="text-xs font-medium text-base-content/40 flex items-center gap-1">
                        <CheckCircle2 size={14} /> {p.acceptance}% Acceptance
                     </div>
                     <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300" />
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* SECTION D: FOOTER CTA */}
      <section className="py-24 bg-base-900 text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-primary/10"></div>
         {/* Decorative blob */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/30 rounded-full blur-[100px]"></div>

         <div className="container mx-auto px-4 text-center relative z-10">
            <BrainCircuit className="w-20 h-20 mx-auto mb-8 text-primary opacity-80" />
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
               Ready to accelerate your career?
            </h2>
            <p className="text-xl opacity-70 mb-10 max-w-2xl mx-auto">
               Join the platform used by students from IIIT Ranchi and beyond to crack their dream offers.
            </p>
            
            {/* LINK TO SIGNUP PAGE */}
            <Link to="/register" className="btn btn-primary btn-lg px-12 rounded-full border-0 shadow-2xl shadow-primary/40 hover:scale-105 transition-transform text-white">
               Create Free Account
            </Link>
         </div>
      </section>

      {/* ---  FOOTER --- */}
      <footer className="bg-base-100 border-t border-base-200 pt-16 pb-8">
         <div className="container mx-auto px-4">
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-16">
               <div className="max-w-xs">
                  <div className="flex items-center gap-2 mb-4">
                     <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/30">
                        <Mountain size={16} fill="currentColor" />
                     </div>
                     <span className="font-bold text-xl tracking-tight">CodeClimb</span>
                  </div>
                  <p className="text-sm text-base-content/60 leading-relaxed">
                     The ultimate platform for mastering data structures and algorithms. Built for the Class of 2026.
                  </p>
               </div>

               {/* Links Column */}
               <div className="flex gap-16">
                  <div>
                     <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-base-content/40">Platform</h4>
                     <ul className="space-y-2 text-sm font-medium opacity-70">
                        <li><Link to="/problems" className="hover:text-primary transition-colors">Problems</Link></li>
                        <li><Link to="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
                        <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                     </ul>
                  </div>
                  <div>
                     <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-base-content/40">Company</h4>
                     <ul className="space-y-2 text-sm font-medium opacity-70">
                        <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                        <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                        <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                     </ul>
                  </div>
               </div>
            </div>

            <div className="border-t border-base-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
               <p className="text-xs font-medium text-base-content/40">
                  &copy; 2026 CodeClimb Inc. All rights reserved.
               </p>

               {/* SOCIAL LINKS (Contact Section) */}
               <div className="flex gap-4">
                  <a href="https://github.com/piyush1056" target="_blank" rel="noreferrer" className="btn btn-circle btn-sm btn-ghost hover:bg-base-200 hover:text-black transition-colors" aria-label="GitHub">
                     <Github size={18} />
                  </a>
                  <a href="https://www.linkedin.com/in/piyush-raj-4338bb263/" target="_blank" rel="noreferrer" className="btn btn-circle btn-sm btn-ghost hover:bg-base-200 hover:text-blue-700 transition-colors" aria-label="LinkedIn">
                     <Linkedin size={18} />
                  </a>
                  <a href="mailto:piyushraj102000@gmail.com" className="btn btn-circle btn-sm btn-ghost hover:bg-base-200 hover:text-red-600 transition-colors" aria-label="Email">
                     <Mail size={18} />
                  </a>
                  {/* <a href="https://yourportfolio.com" target="_blank" rel="noreferrer" className="btn btn-circle btn-sm btn-ghost hover:bg-base-200 hover:text-primary transition-colors" aria-label="Portfolio">
                     <Globe size={18} />
                  </a> */}
               </div>
            </div>

         </div>
      </footer>
    </div>
  );
};

// Feature Card Component 
const FeatureCard = ({ icon, title, desc }) => (
   <div className="p-8 rounded-2xl bg-base-100 border border-base-200 shadow-lg shadow-base-200/50 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
      <div className="mb-6 bg-base-50 w-14 h-14 rounded-xl flex items-center justify-center border border-base-200 shadow-sm">
         {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-base-content">{title}</h3>
      <p className="text-base-content/60 leading-relaxed">
         {desc}
      </p>
   </div>
);

export default LandingPage;
