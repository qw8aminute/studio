import { jsx as _jsx } from "react/jsx-runtime";
// src/pages/Home.tsx
import TileGrid from '../components/Tiles/TileGrid';
export default function Home() {
    return (_jsx("main", { style: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingBottom: '2rem',
        }, children: _jsx(TileGrid, {}) }));
}
