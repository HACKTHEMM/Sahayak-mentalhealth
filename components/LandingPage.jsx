"use client"

import React from "react"
import { Button } from "./ui/button"
import { Background } from "./Background"
import ThemeToggle from "./ThemeToggle"

export default function LandingPage({ onGetStarted, userProfile, onShowProfileSetup, theme, setTheme }) {
  return (
    <main className=" h-screen w-full">
      <div className="relative h-full w-full">
        <Background 
          src="/alt.mp4" 
          placeholder="/landscape.png" 
        />
        
       
        
        {/* Landing Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full gap-8">
          {/* Main Title with Glassmorphic Background */}
          <div className=" p-8 text-center">
            <h1 className="text-white font-serif text-5xl sm:text-8xl lg:text-9xl italic">
              Sahayak
            </h1>
          </div>
          
          {/* Subtitle with Glassmorphic Background */}
          <div className="rounded-2xl px-6 py-3">
            <p className=" text-white font-sans-serif text-xl italic mx-auto">
              Your Mental Health Companion
            </p>
          </div>
          
          {/* Glassmorphic Button */}
          <div className="glass-strong rounded-2xl p-1">
            <Button 
              className="px-8 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-lg border border-white/30 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-glass"
              onClick={onGetStarted}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}