import React, { useState } from 'react';
import './App.css';

const API_BASE_URL = "/api";

function App() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('Joanna');
  const [postId, setPostId] = useState('');
  const [posts, setPosts] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const handleTextChange = (e) => {
    setText(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSayIt = async () => {
    if (!text.trim()) {
      alert('Please enter some text to speak.');
      return;
    }

    // Browser speech synthesis with speed control
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackSpeed;
    speechSynthesis.speak(utterance);

    try {
      const response = await fetch(`${API_BASE_URL}/new_post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voice, text }),
      });
      
      if (response.ok) {
        const responseText = await response.text();
        setPostId(responseText.replace(/"/g, ''));
      }
    } catch (error) {
      console.log('API call failed, using local speech only');
      setPostId(`local-${Date.now()}`);
    }
  };

  const handleSearch = async () => {
    if (!postId.trim()) {
      alert('Please enter a post ID.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/get-post?postId=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : [data]);
      }
    } catch (error) {
      console.error('Search failed:', error);
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
          {postId && <span className="post-id">Post ID: {postId}</span>}
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

        <div className="form-group">
          <label htmlFor="search">Provide Post ID to retrieve:</label>
          <input
            type="text"
            id="search"
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">Search</button>
        </div>

        <table className="posts-table">
          <thead>
            <tr>
              <th>Post ID</th>
              <th>Voice</th>
              <th>Post</th>
              <th>Status</th>
              <th>Player / Download</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={index}>
                <td>{post.id}</td>
                <td>{post.voice}</td>
                <td>{post.text}</td>
                <td>{post.status}</td>
                <td>
                  {post.url && (
                    <>
                      <audio 
                        controls 
                        onLoadedMetadata={(e) => {
                          e.target.playbackRate = playbackSpeed;
                        }}
                        style={{width: '100%', marginBottom: '8px'}}
                      >
                        <source src={post.url} type="audio/mpeg" />
                      </audio>
                      <br />
                      <div className="audio-controls">
                        <button 
                          onClick={() => {
                            const audio = document.querySelector(`audio[src="${post.url}"]`);
                            if (audio) audio.playbackRate = playbackSpeed;
                          }}
                          className="speed-button"
                        >
                          Set Speed {playbackSpeed}x
                        </button>
                        <a 
                          href={post.url} 
                          download={`${post.id}.mp3`}
                          className="download-link"
                        >
                          ⬇️ Download MP3
                        </a>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;