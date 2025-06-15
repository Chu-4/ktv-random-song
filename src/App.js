import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import songsData, {
  // addCategory,
  addSong,
  // removeCategory,
  removeSong,
  togglePickedSong,
  isSongPicked,
  clearPickedSongs
} from './songs';

function MainApp() {
  const categories = Object.keys(songsData);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [randomSong, setRandomSong] = useState('');
  // const [newCategory, setNewCategory] = useState('');
  const [newSong, setNewSong] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setRandomSong('');
  };

  const handleRandomPick = async () => {
    try {
      const response = await fetch('/api/random-song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('获取随机歌曲失败');
      }

      const data = await response.json();
      console.log(data);
      setRandomSong(`${data.song.name} - ${data.song.artist}`);
    } catch (error) {
      console.error('Error:', error);
      setRandomSong('获取随机歌曲失败，请稍后重试');
    }
  };

  // const handleAddCategory = (e) => {
  //   e.preventDefault();
  //   if (newCategory.trim()) {
  //     addCategory(newCategory.trim());
  //     setNewCategory('');
  //     setSelectedCategory(newCategory.trim());
  //   }
  // };

  const handleAddSong = (e) => {
    e.preventDefault();
    if (newSong.trim()) {
      addSong(selectedCategory, newSong.trim());
      setNewSong('');
    }
  };

  // const handleRemoveCategory = (category) => {
  //   if (window.confirm(`确定要删除"${category}"分类吗？`)) {
  //     removeCategory(category);
  //     if (selectedCategory === category) {
  //       setSelectedCategory(categories[0]);
  //     }
  //   }
  // };

  const handleRemoveSong = (song) => {
    if (window.confirm(`确定要删除歌曲"${song}"吗？`)) {
      removeSong(selectedCategory, song);
    }
  };

  const handleTogglePicked = (song) => {
    togglePickedSong(song);
    if (randomSong === song) {
      setRandomSong('');
    }
  };

  const handleClearPicked = () => {
    if (window.confirm('确定要清空所有已点歌曲记录吗？')) {
      clearPickedSongs();
    }
  };

  return (
    <div className="ktv-container">
      <h1>KTV 随机选歌助手</h1>
      <div className="ktv-form">
        <label>
          选择分类：
          <select value={selectedCategory} onChange={handleCategoryChange}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
        <button onClick={handleRandomPick}>随机选歌</button>
        <button
          className="edit-button"
          onClick={() => setShowEditForm(!showEditForm)}
        >
          {showEditForm ? '隐藏编辑' : '编辑歌曲'}
        </button>
      </div>
      <div className="ktv-result">
        {randomSong && (
          <div className="random-song">
            <p>🎤 推荐歌曲：<strong>{randomSong}</strong></p>
            <button
              className={`picked-button ${isSongPicked(randomSong) ? 'picked' : ''}`}
              onClick={() => handleTogglePicked(randomSong)}
            >
              {isSongPicked(randomSong) ? '已点' : '标记已点'}
            </button>
          </div>
        )}
      </div>

      {showEditForm && (
        <div className="edit-form">
          {/* <div className="edit-section">
            <h3>添加新分类</h3>
            <form onSubmit={handleAddCategory}>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="输入新分类名称"
              />
              <button type="submit">添加分类</button>
            </form>
          </div> */}

          <div className="edit-section">
            <h3>添加新歌曲</h3>
            <form onSubmit={handleAddSong}>
              <input
                type="text"
                value={newSong}
                onChange={(e) => setNewSong(e.target.value)}
                placeholder="输入新歌曲名称"
              />
              <button type="submit">添加到当前分类</button>
            </form>
          </div>

          <div className="edit-section">
            <h3>当前分类歌曲列表</h3>
            <div className="song-list">
              {songsData[selectedCategory]?.map((song, index) => (
                <div key={index} className="song-item">
                  <span>{song}</span>
                  <div className="song-actions">
                    <button
                      className={`picked-button ${isSongPicked(song) ? 'picked' : ''}`}
                      onClick={() => handleTogglePicked(song)}
                    >
                      {isSongPicked(song) ? '已点' : '标记已点'}
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleRemoveSong(song)}
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* <div className="edit-section">
            <h3>分类管理</h3>
            <div className="category-list">
              {categories.map((category) => (
                <div key={category} className="category-item">
                  <span>{category}</span>
                  <button
                    className="delete-button"
                    onClick={() => handleRemoveCategory(category)}
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          </div> */}

          <div className="edit-section">
            <h3>已点歌曲管理</h3>
            <button
              className="clear-button"
              onClick={handleClearPicked}
            >
              清空已点记录
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
