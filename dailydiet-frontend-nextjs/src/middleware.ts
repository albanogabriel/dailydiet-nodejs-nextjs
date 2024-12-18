import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const APP_ROUTES = {
  private: {
    home: "/home",
    overview: "/overview",
    meal: "/meal/:id", // Rota dinâmica com parâmetro `id`
  },
  public: {
    login: "/login",
    register: "/cadastro",
    forgetPassword: "/esqueci-senha",
    newPassword: "/nova-senha",
  },
}

export default function authMiddleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const isAuthPage = request.nextUrl.pathname === APP_ROUTES.public.login

  // Valida rotas privadas estáticas
  const isStaticProtectedRoute = Object.values(APP_ROUTES.private).includes(
    request.nextUrl.pathname,
  )

  // Valida rotas privadas dinâmicas
  const isDynamicProtectedRoute = Object.values(APP_ROUTES.private).some(
    (route) => {
      if (route.includes("/:")) {
        // Remove o parâmetro dinâmico e verifica a base da rota
        const baseRoute = route.split("/:")[0]
        return request.nextUrl.pathname.startsWith(baseRoute)
      }
      return false
    },
  )

  const isProtectedRoute = isStaticProtectedRoute || isDynamicProtectedRoute

  // Redireciona usuários não autenticados para a página de login se estiverem em uma rota protegida
  if (isProtectedRoute && !token) {
    const loginUrl = new URL(APP_ROUTES.public.login, request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Redireciona usuários autenticados para a home se estiverem na página de login
  if (isAuthPage && token) {
    const homeUrl = new URL(APP_ROUTES.private.home, request.url)
    return NextResponse.redirect(homeUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    ...Object.values(APP_ROUTES.public), // Rotas públicas
    ...Object.values(APP_ROUTES.private).map((route) => {
      // Verifica se a rota é dinâmica (contém :id)
      if (route.includes("/:")) {
        const baseRoute = route.split("/:")[0]
        return `${baseRoute}/:path*` // Ajusta a rota dinâmica para capturar sub-rotas
      }
      return route
    }),
  ],
}

// orignal middleware.ts

// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"

// export default function authMiddleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value
//   const isAuthPage = request.nextUrl.pathname === "/login"
//   const isProtectedRoute = ["/home", "/dashboard", "/meals"].includes(
//     request.nextUrl.pathname,
//   )

//   // Redirect unauthenticated users from protected routes to the login page
//   if (isProtectedRoute && !token) {
//     const loginUrl = new URL("/login", request.url)
//     return NextResponse.redirect(loginUrl)
//   }

//   // Redirect authenticated users away from the login page to the home page
//   if (isAuthPage && token) {
//     const homeUrl = new URL("/home", request.url)
//     return NextResponse.redirect(homeUrl)
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ["/home", "/dashboard", "/meals", "/login"],
// }
