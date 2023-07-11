import fs from 'fs'
// import productRouter from "./productRouter.js";
import blogRouter from "./blogRouter.js";
import userRouter from "./userRouter.js";
import homeController from "../controller/homeController.js";


let router = {
    '/': homeController.showIndex,
    '/err': homeController.showErr,
    '/home': homeController.showHome
}
// router = {...router, ...productRouter};
router = {...router, ...blogRouter};
router = {...router, ...userRouter};
export default router;
