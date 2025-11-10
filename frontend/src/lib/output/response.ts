export type OtpRespone = {
    message: string;
    email: string;
    rememberToken: string;
    expiredAt: string;
}

export type VerifyRespone = {
    message: string;
    verifiedToken: string;
    email: string;
}

export type ConfirmPasswordRespone = {
     message: string
     newUserId : number
}

export type UserProfileRespone = {
    message : string
    data : UserProfileDetails
}

export type UserProfileDetails = {
    profileCard : ProfileCard
    creditsBalance : number
    bookListed : number
    exchanges : number
    contactInfo : ContactInfo
}

export type ProfileCard = {
    name : string
    email : string
    rating : string
    memberSince : string
    bio : string
    liveIn : string
}

export type ContactInfo = {
    phone : string
    address : string
    prefferedContact : string
}

export type CreditResponse = {
    message : string
    data : {
        balance : number
        totalEarned : number
        totalSpent : number
        exchanges : number
        rating : number
    }
}