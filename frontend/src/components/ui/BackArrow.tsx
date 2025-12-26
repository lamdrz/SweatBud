import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./UI.module.css";
import { useNavigate } from "react-router-dom";

const BackArrow = () => {
    const navigate = useNavigate();

    return (
        <div className={`${styles.uiBtn} ${styles.backArrow}`}
            onClick={() => navigate(-1)}
        >
            <FontAwesomeIcon icon="angle-left" />
        </div>
    );
}

export default BackArrow;