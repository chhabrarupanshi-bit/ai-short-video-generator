import { SignUp } from "@clerk/nextjs";
import { Sparkles, Video, Zap } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#060813] px-4 py-12 text-white sm:px-6 lg:px-8">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[450px] w-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-[450px] w-[500px] rounded-full bg-purple-600/15 blur-[120px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* LEFT BRANDING HERO SECTION */}
        <div className="hidden flex-col justify-center space-y-8 lg:flex">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>AI Studio Engine</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Create Viral Shorts <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                in just 60 seconds.
              </span>
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-[#8a94b8]">
              Scripts, dynamic captions, and AI-driven video synthesis generated seamlessly. Join thousands of creators today.
            </p>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#0b0f19]/70 p-3.5 backdrop-blur-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Zap className="h-5 w-5" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">Instant AI Render</p>
                <p className="text-[11px] text-[#8a94b8]">Fast processing</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#0b0f19]/70 p-3.5 backdrop-blur-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Video className="h-5 w-5" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">9:16 Shorts & Reels</p>
                <p className="text-[11px] text-[#8a94b8]">Ready to upload</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CLERK SIGNUP CONTAINER */}
        <div className="flex items-center justify-center">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full max-w-[440px]",
                card: "border border-white/10 bg-[#0b0f19]/95 shadow-2xl backdrop-blur-xl rounded-3xl p-6 sm:p-8",
                headerTitle: "text-xl font-bold tracking-tight text-white",
                headerSubtitle: "text-xs text-[#8a94b8]",
                socialButtonsBlockButton:
                  "border border-white/10 bg-[#121731] hover:bg-[#181f42] text-white text-xs font-medium rounded-xl transition-all duration-200",
                socialButtonsBlockButtonText: "text-white text-xs font-medium",
                dividerLine: "bg-white/10",
                dividerText: "text-[11px] text-[#8a94b8]",
                formFieldLabel: "text-xs font-medium text-slate-300",
                formFieldInput:
                  "rounded-xl border border-white/10 bg-[#12172b] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none",
                formButtonPrimary:
                  "rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-indigo-600/30 hover:opacity-95 active:scale-[0.99] transition-all",
                footerActionText: "text-xs text-[#8a94b8]",
                footerActionLink: "text-xs font-semibold text-indigo-400 hover:text-indigo-300",
                identityPreviewText: "text-white text-xs",
                identityPreviewEditButton: "text-indigo-400 text-xs",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}