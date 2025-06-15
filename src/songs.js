// 歌曲分类和歌曲列表配置
// 你可以根据需要修改或扩展这些内容

// 从本地存储获取数据，如果没有则使用默认数据

// 从本地存储获取数据
const getStoredData = () => {
  const storedData = localStorage.getItem('ktvSongsData');
  return storedData ? JSON.parse(storedData) : [];
};

// 从本地存储获取已点歌曲
const getStoredPickedSongs = () => {
  const storedPickedSongs = localStorage.getItem('ktvPickedSongs');
  return storedPickedSongs ? JSON.parse(storedPickedSongs) : [];
};

let songsData = getStoredData(); // 歌曲对象数组
let pickedSongs = getStoredPickedSongs(); // 已点歌曲名数组

// 保存数据到本地存储
const saveToStorage = (data) => {
  localStorage.setItem('ktvSongsData', JSON.stringify(data));
};

// 保存已点歌曲到本地存储
const savePickedSongs = (data) => {
  localStorage.setItem('ktvPickedSongs', JSON.stringify(data));
};

export const getSongsData = () => songsData;
export const getPickedSongs = () => pickedSongs;

// 获取所有分类
export const getCategories = () => {
  return Array.from(new Set(songsData.map(song => song.category)));
};
// 获取所有歌手
export const getArtists = () => {
  return Array.from(new Set(songsData.map(song => song.artist)));
};

// 按分类筛选
export const filterByCategory = (category) => {
  return songsData.filter(song => song.category === category);
};
// 按歌手筛选
export const filterByArtist = (artist) => {
  return songsData.filter(song => song.artist === artist);
};
// 按分类和歌手筛选
export const filterByCategoryAndArtist = (category, artist) => {
  return songsData.filter(song => song.category === category && song.artist === artist);
};

// 新增歌曲
export const addSong = (songObj) => {
  // songObj: {name, artist, category}
  if (!songsData.find(s => s.name === songObj.name && s.artist === songObj.artist)) {
    songsData.push(songObj);
    saveToStorage(songsData);
  }
};
// 删除歌曲
export const removeSong = (songObj) => {
  songsData = songsData.filter(s => !(s.name === songObj.name && s.artist === songObj.artist));
  saveToStorage(songsData);
  // 同步移除已点
  pickedSongs = pickedSongs.filter(n => n !== songObj.name);
  savePickedSongs(pickedSongs);
};

// 标记/取消已点
export const togglePickedSong = (songName) => {
  const idx = pickedSongs.indexOf(songName);
  if (idx === -1) {
    pickedSongs.push(songName);
  } else {
    pickedSongs.splice(idx, 1);
  }
  savePickedSongs(pickedSongs);
};
export const isSongPicked = (songName) => pickedSongs.includes(songName);
export const clearPickedSongs = () => {
  pickedSongs = [];
  savePickedSongs(pickedSongs);
};

export default songsData; 