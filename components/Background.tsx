"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "../lib/utils"

const VideoWithPlaceholder = ({ src, className, placeholder }: {
  src: string
  className?: string
  placeholder?: string
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const handleLoadedData = () => setVideoLoaded(true)
      video.addEventListener("loadeddata", handleLoadedData)
      video.load()
      return () => video.removeEventListener("loadeddata", handleLoadedData)
    }
  }, [src])

  useEffect(() => {
    if (videoRef.current && videoLoaded) {
      videoRef.current.play()
    }
  }, [videoLoaded])

  return (
    <>
      {placeholder && (
        <Image
          src={"/landscape.png"}
          alt="Background"
          className={cn(className, { invisible: videoLoaded })}
          fill
          priority
        />
      )}
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        loop
        className={cn(className, { invisible: !videoLoaded })}
      />
    </>
  )
}

export const Background = ({ src, placeholder }: {
  src: string
  placeholder?: string
}) => {
  const isVideo = src.includes('.mp4') || src.includes('.webm')
  const className = "absolute inset-0 w-full h-full object-cover"

  if (isVideo) {
    return <VideoWithPlaceholder src={src} className={className} placeholder={placeholder} />
  }

  return <Image src={src || "/landscape.png"} alt="Background" className={className} fill priority />
}