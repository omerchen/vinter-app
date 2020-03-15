// Deployment Configurations
export const isDebug = true
export const version = "1.4.0"

// UX Configurations
export const timeToVibrate= [6*60,7*60,8*60,9*60] // minutes: 6,7,8,9
export const vibrateDuration= 5*1000 // 5 Seconds
export const liveRequestInterval = 1000 // every second
export const liveSessionTime = 20 * 60 * 1000; // 20 minutes
export const maxLiveRequests = liveSessionTime / liveRequestInterval