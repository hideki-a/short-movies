import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import LikeButton from './LikeButton';
import ShareButton from './ShareButton';
import { MovieInfo } from '../types/MovieInfo';
import styles from './VideoPlayer.module.css';
import './VideoPlayer.css';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  item: MovieInfo;
  itemIndex: number;
  currentPlayingIndex: number | null;
  setCurrentPlayingIndex: (index: number) => void;
  isMuted: boolean;
  onMuteChange: (muted: boolean) => void;
}

export default function VideoPlayer({ item, itemIndex, currentPlayingIndex, setCurrentPlayingIndex, isMuted, onMuteChange }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const player = useRef<Player | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 1.0,
  });

  const videoOptions = useMemo(() => {
    return {
      fill: true,
      controls: true,
      loop: true,
      autoplay: false,
      muted: true,
      preload: 'none',
      controlBar: {
        pictureInPictureToggle: false,
        fullscreenToggle: false,
        remainingTimeDisplay: false,
      },
      html5: {
        vhs: {
          enableLowInitialPlaylist: false,
          overrideNative: true,
        },
        nativeAudioTracks: false,
        nativeVideoTracks: false,
        nativeTextTracks: false,
      },
    };
  }, []);

  const videoReadyCallback = useCallback(() => {
    if (!inView) {
      player.current?.load();
    }

    player.current?.on('volumechange', () => {
      if (player.current) {
        onMuteChange(player.current.muted() ?? false);
      }
    });
  }, [onMuteChange, inView]);

  useEffect(() => {
    if (inView) {
      if (!isInitialized && videoRef.current) {
        player.current = videojs(videoRef.current, videoOptions, videoReadyCallback);
        setIsInitialized(true);
      } else if (isInitialized && player.current) {
        player.current.muted(isMuted);
        player.current.play();
        setCurrentPlayingIndex(itemIndex);
      }
      if (videoRef.current) {
        navigate(`/shorts/${item.basename}`, { replace: true });
      }
    } else {
      if (isInitialized && player.current && !player.current.paused()) {
        player.current.pause();
        player.current.currentTime(0);
      } else if (!isInitialized && videoRef.current && currentPlayingIndex) {
        if ((itemIndex === currentPlayingIndex + 1 || itemIndex === currentPlayingIndex - 1)) {
          player.current = videojs(videoRef.current, videoOptions, videoReadyCallback);
          setIsInitialized(true);
        }
      }
    }
  }, [inView, itemIndex, isInitialized, isMuted, onMuteChange, currentPlayingIndex, setCurrentPlayingIndex, videoOptions, videoReadyCallback, navigate, item.id]);

  return (
    <div ref={ref} className={styles.container}>
      <img src={item.poster} className={styles.preloadPoster} loading="eager" />
      <video
        ref={videoRef}
        playsInline
        className="video-js"
        poster={item.poster}
      >
        <source src={item.src} type="application/x-mpegURL" />
      </video>
      <LikeButton key={'like_' + item.index} id={item.id} playerInit={isInitialized} />
      <ShareButton key={'share_' + item.index} item={item} />
    </div>
  );
};
