/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import Route from '@adonisjs/core/services/router'
import UsuariosController from '#controllers/UsuariosController'
router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router.post('/usuarios/registrar', [UsuariosController, 'registrar'])
router.post('/usuarios/iniciar', '#controllers/UsuariosController.iniciar')
