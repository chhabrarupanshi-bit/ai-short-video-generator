import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function SignInPage() {
  return (
    <main className="min-h-screen w-full bg-[#07090e] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      
      {/* Background Ambient Glow (GPU accelerated) */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[450px] h-80 sm:h-[450px] bg-purple-600/15 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 sm:w-[350px] h-72 sm:h-[350px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Glassmorphic Wrapper */}
      <div className="relative z-10 w-full max-w-5xl rounded-2xl sm:rounded-3xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Side: Desktop-Only Visual Showcase (Mobile par 0 space lega) */}
        <section className="hidden lg:flex flex-col justify-between p-10 xl:p-12 bg-gradient-to-b from-slate-900/70 via-slate-950/50 to-slate-950/90 border-r border-slate-800/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              AI Studio Engine
            </div>
            
            <h1 className="mt-5 text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Create Viral Shorts <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                in just 60 seconds.
              </span>
            </h1>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-md">
              Scripts, dynamic captions, and AI-driven video synthesis generated seamlessly.
            </p>
          </div>

          {/* Phone Preview */}
          <div className="my-6 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-tr from-purple-600 to-indigo-600 opacity-30 blur-lg transition duration-500 group-hover:opacity-50" />
              <div className="relative w-[190px] h-[370px] rounded-[24px] overflow-hidden border border-slate-700/80 bg-black shadow-2xl">
                <Image
                  src="/login.png"
                  alt="App preview"
                  fill
                  sizes="190px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-slate-800/60 text-xs text-slate-400">
            <span>⚡ Instant AI Render</span>
            <span>🎯 9:16 Shorts & Reels</span>
          </div>
        </section>

        {/* Right Side: Sign-In Form (Mobile par pura screen adapt karega) */}
        <section className="flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 w-full">
          {/* Mobile-Only Header Brand Tag */}
          <div className="lg:hidden text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-2">
              AI Video Engine
            </span>
            <h2 className="text-xl font-bold text-white">Welcome back</h2>
          </div>

          <div className="w-full max-w-sm flex justify-center">
            <SignIn
              appearance={{
                variables: {
                  colorPrimary: '#9333ea',
                  colorBackground: '#0d111d',
                  colorInputBackground: '#131929',
                  colorInputText: '#ffffff',
                  colorText: '#ffffff',
                  colorTextSecondary: '#94a3b8',
                },
                elements: {
                  rootBox: "w-full",
                  card: "!bg-[#0d111d]/90 !border !border-slate-800 !shadow-2xl rounded-2xl p-5 sm:p-7 text-white w-full",
                  headerTitle: "!text-xl sm:!text-2xl !font-bold !text-white tracking-tight",
                  headerSubtitle: "!text-slate-400 text-xs sm:text-sm mt-1",
                  socialButtonsBlockButton: 
                    "!border !border-slate-700 !bg-slate-900 hover:!bg-slate-800 !text-slate-200 transition-all rounded-xl",
                  socialButtonsBlockButtonText: "!text-slate-200 text-xs sm:text-sm font-medium",
                  dividerLine: "!bg-slate-800",
                  dividerText: "!text-slate-500 text-xs uppercase tracking-wider",
                  formFieldLabel: "!text-slate-300 text-xs font-semibold tracking-wide",
                  formFieldInput: 
                    "!border-slate-700 !bg-[#131929] !text-white rounded-xl focus:!border-purple-500 text-sm transition-all",
                  formButtonPrimary: 
                    "!bg-gradient-to-r !from-purple-600 !to-indigo-600 hover:opacity-90 !text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-purple-900/40 text-sm transition-all",
                  footerActionText: "!text-slate-400 text-xs sm:text-sm",
                  footerActionLink: "!text-purple-400 hover:!text-purple-300 font-semibold",
                  footer: "!bg-transparent",
                  identityPreviewText: "!text-slate-200",
                  identityPreviewEditButtonIcon: "!text-purple-400",
                },
              }}
            />
          </div>
        </section>

      </div>
    </main>
  )
}