import DiatonicCircle from './components/DiatonicCircle';
import { makeShell, chordToDegrees } from './lib/musicVoicing';
import './App.css';

function App() {
  // Demo: Voice-leading from Em7 (1st inv) to Am7 (root pos) in C major
  const key = 'C';
  const fromChordShell = makeShell('Em7', 1); // G-D-E
  const toChordShell = makeShell('Am7', 0);   // A-C-G

  const fromDegrees = chordToDegrees(fromChordShell, key);
  const toDegrees = chordToDegrees(toChordShell, key);

  return (
    <div className="App">
      <h1>Music Topology</h1>
      <p>Voice leading from <b>{fromChordShell.symbol}</b> to <b>{toChordShell.symbol}</b> in {key} major</p>
      <DiatonicCircle
        fromDegrees={fromDegrees}
        toDegrees={toDegrees}
      />
    </div>
  );
}

export default App;
