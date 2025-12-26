import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./UI.module.css";
import { useState } from "react";

const ActionMenu = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (<>
        <div className={`${styles.uiBtn} ${styles.actionMenu}`}
            onClick={() => setIsOpen(!isOpen)}>
            <FontAwesomeIcon icon="ellipsis-vertical" />
        </div>

        { isOpen && 
            <div className={styles.dropdownMenu}>
                {children}
            </div>
        }

        { isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)}></div> }
    </>);
}

export default ActionMenu;