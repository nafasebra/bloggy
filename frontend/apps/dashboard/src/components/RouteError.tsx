import { useRouteError } from "react-router";

export default function RouteError() {
  const error = useRouteError();

  return (
    <div className="p-10 h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  );
}
