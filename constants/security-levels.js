import {Platform} from "react-native"

// Require password on android devices only!
export const SECURE_MODE = Platform.OS == "android"

export const PASSWORDS = ["Omer8060","Vinter8060","Vl123456!","1"]
export const SECURE_LEVEL_NO_PASSWORD = PASSWORDS.length // any player at the club
export const SECURE_LEVEL_FOUNDER = 0 // the founder of the club
export const SECURE_LEVEL_ADMIN = 1 // the fixture manager only
export const SECURE_LEVEL_BOARD = 2 // one of the admins of the club
export const SECURE_LEVEL_CLUB = 3 // any player at the club

export const SECURE_LEVEL_LABELS = ["מייסד","מנהל בכיר","חבר ועדה","חבר בקבוצה"]
