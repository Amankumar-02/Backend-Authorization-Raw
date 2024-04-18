// this handler only work is to wrap the controller in a asyn await Promise

export const AsyncHandler = (requestHandler)=>{
    return async (req, res, next)=>{
        try {
            await Promise.resolve(requestHandler(req, res, next))
            // .catch(err=>next(createError(err)));
        } catch (error) {
            next(error);
        }
    };
};