import React, { useState } from 'react';
import './App.css';

const API_BASE_URL = "/api";

function App() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('Joanna');
  const [charCount, setCharCount] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [audioUrl, setAudioUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTextChange = (e) => {
    setText(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSayIt = async () => {
    if (!text.trim()) {
      alert('Please enter some text to speak.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackSpeed;
    speechSynthesis.speak(utterance);
  };

  const handleGenerateAudio = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate audio.');
      return;
    }

    setIsGenerating(true);
    setAudioUrl('');

    try {
      const response = await fetch(`${API_BASE_URL}/new_post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voice, text }),
      });
      
      if (response.ok) {
        const postId = await response.text();
        const cleanPostId = postId.replace(/"/g, '');
        
        const checkAudio = async () => {
          try {
            const checkResponse = await fetch(`${API_BASE_URL}/get-post?postId=${cleanPostId}`);
            if (checkResponse.ok) {
              const data = await checkResponse.json();
              const post = Array.isArray(data) ? data[0] : data;
              
              if (post.status === 'COMPLETED' && post.url) {
                setAudioUrl(post.url);
                setIsGenerating(false);
              } else {
                setTimeout(checkAudio, 2000);
              }
            }
          } catch (error) {
            console.error('Error checking audio status:', error);
            setIsGenerating(false);
          }
        };
        
        setTimeout(checkAudio, 3000);
      }
    } catch (error) {
      console.error('Audio generation failed:', error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="app">
      <div className="content">
        <div className="form-group">
          <label htmlFor="voice">Voice:</label>
          <select 
            id="voice" 
            value={voice} 
            onChange={(e) => setVoice(e.target.value)}
            className="voice-select"
          >
            <option value="Joanna">Joanna [English]</option>
            <option value="Maja">Maja [Polish]</option>
            <option value="Enrique">Enrique [Spanish]</option>
            <option value="Marlene">Marlene [German]</option>
            <option value="Mathieu">Mathieu [French]</option>
            <option value="Cristiano">Cristiano [Portuguese]</option>
            <option value="Liv">Liv [Norwegian]</option>
            <option value="Mizuki">Mizuki [Japanese]</option>
            <option value="Carla">Carla [Italian]</option>
            <option value="Carmen">Carmen [Romanian]</option>
            <option value="Tatyana">Tatyana [Russian]</option>
            <option value="Astrid">Astrid [Swedish]</option>
            <option value="Filiz">Filiz [Turkish]</option>
            <option value="Gwyneth">Gwyneth [Welsh]</option>
            <option value="Karl">Karl [Icelandic]</option>
          </select>
          
          <label htmlFor="speed">Speed:</label>
          <select 
            id="speed" 
            value={playbackSpeed} 
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            className="voice-select"
          >
            <option value="0.5">0.5x (Slow)</option>
            <option value="0.75">0.75x</option>
            <option value="1.0">1.0x (Normal)</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x (Fast)</option>
            <option value="2.0">2.0x (Very Fast)</option>
          </select>
          
          <button onClick={handleSayIt} className="say-button">Say it!</button>
          <button onClick={handleGenerateAudio} className="generate-button" disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate Audio'}
          </button>
        </div>

        <div className="form-group">
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Write your text here..."
            rows="4"
            className="text-input"
          />
          <div className="char-counter">Characters: {charCount}</div>
        </div>

        {audioUrl && (
          <div className="audio-section">
            <h3>Generated Audio</h3>
            <audio 
              controls 
              onLoadedMetadata={(e) => {
                e.target.playbackRate = playbackSpeed;
              }}
              style={{width: '100%', marginBottom: '15px'}}
            >
              <source src={audioUrl} type="audio/mpeg" />
            </audio>
            <div className="audio-controls">
              <button 
                onClick={() => {
                  const audio = document.querySelector('audio');
                  if (audio) audio.playbackRate = playbackSpeed;
                }}
                className="speed-button"
              >
                Set Speed {playbackSpeed}x
              </button>
              <a 
                href={audioUrl} 
                download={`audio-${Date.now()}.mp3`}
                className="download-link"
              >
                ⬇️ Download MP3
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;