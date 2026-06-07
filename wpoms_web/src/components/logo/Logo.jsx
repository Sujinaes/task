import styles from './logo.module.css';

export const Logo = () => {
    return <div className={styles.logoRow}>
        <div className={styles.logoMark}>
            <span className={styles.logoLetter}>W</span>
        </div>
        <div className={styles.logoText}>
            <span className={styles.logoTitle}>WPOMS</span>
            <span className={styles.logoSubtitle}>Enterprise Management</span>
        </div>
    </div>
}

export const LogoWithoutSubtitle = () => {
    return <div className={styles.logoRow}>
        <div className={styles.logoMark}>
            <span className={styles.logoLetter}>W</span>
        </div>
        <div className={styles.logoText}>
            <span className={styles.logoTitle}>WPOMS</span>
        </div>
    </div>
}