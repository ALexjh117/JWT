/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

import UsuariosController from '#controllers/UsuariosController'
import AuthMiddleware from '#middleware/auth_middleware'
const usuariosController = new UsuariosController()
const authMiddleware = new AuthMiddleware()
router.post('/usuarios/registrar', usuariosController.registrar.bind(usuariosController)) // oe zunga el bind es por lo que usamos el this en el controlador por si algo locota

router.post('/usuarios/iniciar', usuariosController.iniciar.bind(usuariosController))// fue ayuda de el tio chatgpt esta parte
router.get('/usuarios/yo', usuariosController.yo.bind(usuariosController))
router.post('/logout', usuariosController.cerrar.bind(usuariosController))
router.get('/equipos',(ctx)=>authMiddleware.mildde(ctx,()=>EquiposController.traer(ctx))) 


