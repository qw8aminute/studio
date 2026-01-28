// src/pages/Home.tsx
import TileGrid from '../components/Tiles/TileGrid';

export default function Home() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'flex-end',
      paddingBottom: '2rem',
    }}>
      <TileGrid />
    </main>
  );
}
