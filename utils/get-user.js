import { User } from "../model/user.model.js";
import { fastify } from "../server.js";

export const GetUserMiddleware = async (req, reply) => {
    const authorization = req?.headers?.authorization;
    if (!authorization) {
        reply.status(401);
        throw new Error("You need to be authorized");
    }
    
    const [bearer, token] = authorization.toString().split(" ");
    if (bearer && bearer.toLowerCase() === "bearer") {
        try {
            const result = fastify.jwt.verify(token);
            if (typeof result === "string") {
                reply.status(400);
                throw new Error(result);
            }
            
            const { username } = result;
   
            const user = await User.findOne({
                where: { username }
            });
            if (!user) {
        
                reply.status(401);
                throw new Error("Please try to login");
            }
            

            req.user = user.dataValues;
            next(); 
        } catch (error) {
            next(error);
        }
    } else {
   
        reply.status(401);
        throw new Error("Your token is not a valid bearer token");
    }
};
