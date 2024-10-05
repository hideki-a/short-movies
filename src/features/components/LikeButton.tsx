import styles from './LikeButton.module.css';
import { useEffect, useState } from 'react';

interface LikeCount {
  count: number,
  voted: boolean,
}

export default function LikeButton({ id, playerInit }: { id: number, playerInit: boolean }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const endpoint = `${import.meta.env.VITE_API_URL}/vote/${id}`;

  const fetchLikeCount = async () => {
    const response = await fetch(endpoint, { credentials: 'include' });
    const json: LikeCount = await response.json();
    setLikeCount(json.count);
    if (json.voted) {
      setLiked(true);
    }
  };

  const handleClick = async () => {
    setLiked(true);
    setLikeCount(likeCount + 1);

    const options: RequestInit = {
      method: 'POST',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({value: 'like'})
    };
    const response = await fetch(endpoint, options);
    if (response.status === 400) {
      setLiked(false);
      setLikeCount(likeCount - 1);
    }
  };

  useEffect(() => {
    if (playerInit) {
      fetchLikeCount();
    }
  }, [playerInit]);

  return (
    <div className={styles.container}>
      <button type='button' onClick={handleClick} disabled={liked} className={styles.button + ' ' + (liked ? styles.buttonLiked : '')}>
        <span className={styles.buttonLabel}>Like</span>
      </button>
      <div className={styles.counter}>{likeCount}</div>
    </div>
  )
}
