import styles from './ShareButton.module.css';
import { MovieInfo } from '../types/MovieInfo';

export default function ShareButton({ item }: { item: MovieInfo }) {
  const canShare = () => navigator.canShare();
  const handleClick = () => {
    const shareData: ShareData = {
      title: item.title,
      url: `/shorts/${item.id}`,
    };
    navigator.share(shareData);
  };

  return (
    <button type='button' onClick={handleClick} className={styles.button} disabled={!canShare}>
      <span className={styles.buttonLabel}>共有</span>
    </button>
  )
}
