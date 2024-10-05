import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import VideoList from "./features/components/VideoList";
import ShortStage from "./features/components/ShortStage";
import { MovieInfo } from "./features/types/MovieInfo";

const basename: string = ''; // NOTE: テストアップ時に使用

function App() {
  const [movies, setMovies] = useState<MovieInfo[]>([]);

  useEffect(() => {
    fetch(`${basename}/shorts.json`)
      .then((response) => response.json())
      .then((data: MovieInfo[]) => setMovies(data))
      .catch((error) => console.error('Error fetching short movies:', error));
  }, []);

  return (
    <Router basename={basename}>
      <Routes>
        <Route path='/' element={<VideoList items={movies} />} />
        <Route path='/shorts/:basename' element={<ShortStage items={movies} />} />
      </Routes>
    </Router>
  )
}

export default App
