import { Link } from 'react-router-dom';
import { MovieInfo } from '../types/MovieInfo';
import styles from './VideoList.module.css';

interface VideoListProps {
  items: MovieInfo[];
}

export default function VideoList({ items }: VideoListProps) {
  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.index} className={styles.listItem}>
            <Link to={`/shorts/${item.basename}`}><img src={item.poster} alt={item.title} className={styles.thumbnail} /></Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
