import http from "../axios";

export const apiGetSong = (sid) => http.get(`/song`, sid)

export const apiGetAllSongs = (params) => http.get(`/songs`, {params})

export const apiGetComment = (params, sid) => http.get(`/songs/${sid}/comments`, {params})

export const apiGetPlaylist = (params) => http.get('/playlists', {params})
export const apiGetPlaylistById = (pid) => http.get(`/playlists/${pid}`)

export const apiAddSongToPlaylist = (sid, pid) => http.post(`/playlists/${pid}/add/${sid}`)
export const apiLikeSong = (sid) => http.post(`songs/${sid}/like`)
export const apiUnLikeSong = (sid) => http.post(`/songs/${sid}/unlike`)
export const apiIncresingView = (sid) => http.post(`/songs/${sid}/increment_view`)

export const apiGetFavoritePlaylist = (params) => http.get('/songs/favorites_list', {params})

export const apiCreatePlaylist = (body) => http.post('/playlists/create', body)



export const apiGetDetailSong = (sid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await http({
        url: "/songs",
        method: "GET",
        params: { id: sid },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetDetailPlaylist = (pid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await http({
        url: "/detailplaylist",
        method: "GET",
        params: { id: pid },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apigetSongsByAlbumId = (aid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await http({
        url: `songs?album.id=${aid}`,
        method: "GET",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetAlbumDetail = (aid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await http({
        url: "albums",
        method: "GET",
        params: { id: aid },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetCommentBySId = (sid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await http({
        url: `song/${sid}/comments`,
        method: "GET",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetComposers = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await http({
        url: "composers?sortBy=id&page=1&limit=50",
        method: "GET",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetArtists = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await http({
        url: "artists?sortBy=followCount&page=1&limit=50",
        method: "GET",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetArtistBySlug = (slug) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await http({
        url: `artists?slug=${slug}`,
        method: "GET",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetSongsByArtistId = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await http({
        url: `songs?artists.id=${id}`,
        method: "GET",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

  export const apiSearchSong = (search) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await http({
        url: `songs?search=${search}`,
        method: "GET",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
