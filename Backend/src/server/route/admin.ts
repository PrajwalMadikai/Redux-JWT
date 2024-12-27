import expres from 'express'
import adminController from '../controller/adminController'
import authMiddleware from '../middleware/authMiddleware'
const router = expres.Router()

router.post('/login',adminController.login)
router.get('/users',authMiddleware,adminController.users)

router.get('/edit/:id',authMiddleware,adminController.editGet)
router.post('/edit/:id',authMiddleware,adminController.editPost)
router.post('/create',authMiddleware,adminController.createUser)
router.delete('/delete/:id',authMiddleware,adminController.deleteUser)
router.post('/logout',adminController.logout)


export default router