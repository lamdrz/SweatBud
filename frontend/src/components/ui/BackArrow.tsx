import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./UI.module.css";
import { useNavigate, type To } from "react-router-dom";

const BackArrow = ({ destination }: { destination: string | number }) => {
    const navigate = useNavigate();

    return (
        <div className={`${styles.uiBtn} ${styles.backArrow}`}
            onClick={() => navigate(destination as To)}
        >
            <FontAwesomeIcon icon="chevron-left" />
        </div>
    );
}

export default BackArrow;