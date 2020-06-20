// Deployment Configurations
export const isDebug = false
export const version = "3.3.1"

// UX Configurations
export const timeToVibrate= [6*60,7*60,8*60,9*60] // minutes: 6,7,8,9
export const vibrateDuration= 5*1000 // 5 Seconds
export const liveRequestInterval = 3000 // every 3 seconds
export const liveSessionTime = 120 * 60 * 1000; // 120 minutes
export const maxLiveRequests = liveSessionTime / liveRequestInterval
export const soldierCost = 15
export const standardCost = 25