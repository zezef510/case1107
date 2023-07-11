import fs from 'fs'
import userController from "../controller/userController.js";
import homeController from "../controller/homeController.js";
import userService from "../service/userService.js";

let userRouter = {
    '/user/manager': userController.showAllAcc,
    '/login': userController.showFormLogin,
    '/register': userController.showFromRegister,
    '/': homeController.showIndex,
    '/user/edit':userController.showFormEdit,
    '/delete' : userController.delete,


}

export default userRouter;

