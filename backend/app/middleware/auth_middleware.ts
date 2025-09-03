import jwt from 'jsonwebtoken'
import env from '#start/env'
import Usuario from '#models/usuario'
import type { HttpContext } from '@adonisjs/core/http'
export default class AuthMiddleware {
  async mildde({ request, response }: HttpContext, next: () => Promise<void>) {
    const cookies = request.headers().cookie
    const token = cookies
    if (!token) {
      return response.json({ mensaje: 'token invalido' })
    }
    try {
      const secret = env.get('JWT_SECRET') as string
      const payload = jwt.verify(token, secret)
      if (payload) {
        return response.unauthorized({ mensaje: 'token invalido' })
      }
      const usuario = await Usuario.find(payload.sub)
      ;(request as any).usuario = usuario
      await next()
    } catch (e) {
      return response.json({ mensaje: 'token invalido' })
    }
  }
}
