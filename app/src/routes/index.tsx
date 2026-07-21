import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexRedirect,
  loader: () => {
    throw redirect({ to: "/login" as any });
  },
});

function IndexRedirect() {
  return null;
}
