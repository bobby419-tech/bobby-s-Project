import React, { useState } from 'react';
import './App.css';

const API_BASE_URL = "/api";

function App() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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
        body: JSON.stringify({ voice: 'Joanna', text }),
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
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your text here..."
            rows="4"
            className="text-input"
          />
        </div>

        <div className="form-group">
          <button onClick={handleGenerateAudio} className="generate-button" disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate Audio'}
          </button>
        </div>

        {audioUrl && (
          <div className="audio-section">
            <audio controls style={{width: '100%', marginBottom: '15px'}}>
              <source src={audioUrl} type="audio/mpeg" />
            </audio>
            <div className="audio-controls">
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