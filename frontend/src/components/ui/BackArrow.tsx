import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./UI.module.css";
import { useNavigate } from "react-router-dom";

const BackArrow = ({ destination }: { destination: string }) => {
    const navigate = useNavigate();

    return (
        <div className={`${styles.uiBtn} ${styles.backArrow}`}
            onClick={() => navigate(destination ?? -1)}
        >
            <FontAwesomeIcon icon="chevron-left" />
        </div>
    );
}

export default BackArrow;