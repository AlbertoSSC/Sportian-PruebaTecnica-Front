import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from '@/core/providers';
import { HomeScene } from '@/scenes';

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScene />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;

