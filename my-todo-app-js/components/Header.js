// components/Header.js
import Link from 'next/link';
import styles from './../styles/Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                <Link href="/" passHref legacyBehavior>
                    <a className={styles.title}>
                        📝 My To-Do List
                    </a>
                </Link>
            </div>
        </header>
    );
}