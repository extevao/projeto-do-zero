import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <img src="/images/logo.svg" alt="Logo da Aplicação" />
    </header>
  );
}
