
import jwt from "jsonwebtoken";
import type{TokenPayload} from "../types/TokenPayload"
export const verifyToken = (token : string) => {
    return jwt.verify(
        token, 
        process.env.JWT_SECRET as string
    ) as TokenPayload;
}