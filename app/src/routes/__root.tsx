import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";

declare const __HF_DESIGN_INSPECTOR__: boolean;

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4" style={{background:'var(--color-umain-bg)'}}>
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold" style={{color:'var(--color-umain-accent)'}}>404</h1>
        <p className="mt-4 text-lg" style={{color:'var(--color-umain-text-secondary)'}}>Pagina no encontrada</p>
        <Link to="/" className="umain-button-primary mt-6 inline-flex">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {}, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center px-4" style={{background:'var(--color-umain-bg)'}}>
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold">Error en la pagina</h1>
        <p className="mt-2" style={{color:'var(--color-umain-text-secondary)'}}>
          Algo salio mal. Intenta recargar o vuelve al inicio.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="umain-button-primary">
            Reintentar
          </button>
          <a href="/" className="umain-button-outline">Ir al inicio</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "UMAIN - Plataforma de Avatares Digitales" },
      { name: "description", content: "Gestion de identidades digitales, consentimiento y licencias" },
      { property: "og:title", content: "UMAIN Platform" },
      { property: "og:description", content: "Gestion de identidades digitales" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es" style={{ colorScheme: "dark" }}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
