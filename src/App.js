import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/Zirve.css';
 
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './components/Home';
import Study from './components/Study';
import KelimeCalis from './components/KelimeCalis';
import KelimeCevir from './components/KelimeCevir';
import SocialPage from './components/Social';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />   
          <Route path="/calis" element={<Study />} />   
          <Route path='/calis/kelime' element={<KelimeCalis />} />
          <Route path='/calis/kelime/ceviri' element={<KelimeCevir />} />

          <Route path='/sosyal/' element={<SocialPage></SocialPage>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
