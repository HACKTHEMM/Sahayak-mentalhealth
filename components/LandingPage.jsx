"use client"

import React from "react"
import { Button } from "./ui/button"
import { Background } from "./Background"
import ThemeToggle from "./ThemeToggle"

export default function LandingPage({ onGetStarted, userProfile, onShowProfileSetup, theme, setTheme }) {
  return (
    <main className="p-4 h-screen w-full">
      <div className="relative h-full w-full">
        <Background 
          src="/your-video.mp4" 
          placeholder="/your-image.jpg" 
        />
        
        {/* Theme Toggle - Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
        
        {/* Landing Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full gap-8">
          <h1 className="font-serif text-5xl sm:text-8xl lg:text-9xl italic text-white drop-shadow-2xl">
            Sahayak
          </h1>
          <p className="font-sans-serif text-xl italic text-white mx-auto ">
            Your Mental Health Companion
          </p>
          <Button 
            className="px-8 bg-white/55 hover:bg-white text-black font-semibold"
            onClick={onGetStarted}
          >
            Get Started
          </Button>
        </div>
      </div>
    </main>
  )
}