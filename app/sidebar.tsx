import Link from 'next/link';
import styles from '../styles/sidebar.module.css';

export default function Sidebar() {
    return (
        <div className={styles.nav_sidebar}>
            <h1 className={styles.app_title}>It Is Done</h1>
            <h5 className={styles.option}>
                <Link href="/charges">Dashboard</Link>
            </h5>
            <h5 className={styles.option}>
                <Link href="/invoices">Invoices</Link>
            </h5>
            <h5 className={styles.option}>
                <Link href="/clients">Clients</Link>
            </h5>
        </div>
    )
}