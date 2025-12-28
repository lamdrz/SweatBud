import { Link } from "react-router-dom";

export default function Error404Page() {

  return (
    <div id="error-page">
      <p>Cette page n'existe pas</p>
      <p>
        <i>404 Not Found</i>
      </p>
      <Link to='/'>Retour à l'accueil</Link>
    </div>
  );
}