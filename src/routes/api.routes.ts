import express from 'express'
import userRouter from './user.routes'
import fileRouter from './file.routes'
import folderRouter from './folder.routes'


const apiRouter = express.Router()

apiRouter.use('/user', userRouter)
apiRouter.use('/file', fileRouter)
apiRouter.use('/folder', folderRouter)

export default apiRouter
