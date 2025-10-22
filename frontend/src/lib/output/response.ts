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