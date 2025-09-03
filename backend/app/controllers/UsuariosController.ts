/* eslint-disable @unicorn/filename-case */
import Usuario from '#models/usuario'
import type { HttpContext } from '@adonisjs/core/http'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from '#start/env'

class UsuariosController {
  async registrar({ request, response }: HttpContext) {
    const { nombre, correo, contrasena, rol } = request.body()
    console.log('VALORES DESTRUCTURADOS:', { nombre, correo, contrasena, rol })
    // Verificar si ya existe
    const usuarioExiste = await Usuario.findBy('correo', correo)
    if (usuarioExiste) {
      return response.badRequest({ mensaje: 'El correo ya existe' })
    }

    // Encriptar contraseña
    const nuevacontrasena = await bcrypt.hash(contrasena, 10)

    // Crear usuario
    const usuario = await Usuario.create({
      nombre,
      correo,
      contrasena: nuevacontrasena,
      rol,
    })

    return response.json({ mensaje: 'Usuario registrado', data: usuario })
  }

  async iniciar({ request, response }: HttpContext) {
    const { correo, contrasena } = request.body()
    console.log('BODY COMPLETO:', request.body())

    const usuario = await Usuario.findBy('correo', correo)
    if (!usuario) {
      return response.notFound({ mensaje: 'El usuario no existe' })
    }

    const valido = await bcrypt.compare(contrasena, usuario.contrasena)
    if (!valido) {
      return response.unauthorized({ mensaje: 'Credenciales inválidas' })
    }

    // Generar token
    const token = this.generarJWT({ sub: usuario.id })

    // Devolver token en header y en body
    response.cookie('token', token, {
      httpOnly: true, // protege contra JS en el navegador
      sameSite: 'lax', // evita CSRF básicos -- /consultar massss sobre esto///
      secure: false, // estico toca ponerlo en true  oseaaaaaaa(HTTPS)
      maxAge: 60 * 60 * 24 * 7, // 7 días
    })

    return response.json({ mensaje: 'Login exitoso' })
  }

  generarJWT(payload: Object) {
    const secret = env.get('JWT_SECRET')
    if (!secret) {
      throw new Error(' JWT_SECRET no está definido en .env')
    }
    return jwt.sign(payload, secret as string, { expiresIn: '7d' })
  }

  yo({ request, response }): HttpContext {
    const usuario = (request as any).usuario
    if (!usuario) {
      return response.json({ mensaje: 'No autenticado' })
    } else {
      return response.json({ usuario })
    }
  }
  cerrar({ response }) {
    response.clearCookie('token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
    })
    return response.json({ mensaje: 'Sesión cerrada' })
  }
}

export default UsuariosController
