import { useRouteError, Link, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  let errorStatus: number | undefined;
  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
      errorStatus = error.status;
      errorMessage = error.statusText || 'An unexpected error has occurred.';
  } else if (error instanceof Error) {
      errorMessage = error.message;
  } else if (typeof error === 'string') {
      errorMessage = error;
  } else {
      errorMessage = 'Unknown error';
  }

  return (
    <div id="error-page">
      <p>Désolé, une erreur inattendue est survenue.</p>
      <p>
        <i>{errorStatus} {errorMessage}</i>
      </p>
      <Link to='/'>Retour à l'accueil</Link>
    </div>
  );
}