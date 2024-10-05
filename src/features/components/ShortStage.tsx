import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import { MovieInfo } from '../types/MovieInfo';
import styles from './ShortStage.module.css'

interface ShortStageProps {
  items: MovieInfo[];
}

export default function ShortStage({ items }: ShortStageProps) {
  const { basename } = useParams<{ basename: string }>();
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const currentVideoContainerRefs = useRef<HTMLDivElement | null>(null);
  const currentVideoIndex: number | null = items.find(item => item.basename === basename)?.index ?? null;

  useEffect(() => {
    if (currentVideoContainerRefs.current) {
      currentVideoContainerRefs.current.scrollIntoView({ behavior: 'instant' });
      currentVideoContainerRefs.current = null;
    }
  });

  return (
    <div className={styles.stage}>
      <div className={styles.scrollView}>
        {items.map((item) => (
          <div key={'player_' + item.index} ref={currentVideoIndex === item.index ? currentVideoContainerRefs : null} className={styles.movie}>
            <VideoPlayer
              key={item.index}
              item={item}
              itemIndex={item.index}
              currentPlayingIndex={currentPlayingIndex}
              setCurrentPlayingIndex={setCurrentPlayingIndex}
              isMuted={isMuted}
              onMuteChange={setIsMuted}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
