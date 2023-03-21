function path(root, sublink) {
  return `${root}${sublink}`
}
// dashboard layout
const ROOT_DASHBOARD = '/dashboard'
const ROOT_SONG = '/dashboard/song'
const ROOT_USER = '/dashboard/user'
const ROOT_ARTIST = '/dashboard/artist'
const ROOT_COMPOSER = '/dashboard/composer'
const ROOT_ALBUM = '/dashboard/album'
const ROOT_CATEGORY = '/dashboard/category'
const ROOT_TAG = '/dashboard/tag'
const ROOT_ROLE = '/dashboard/role'

// profile layout
const ROOT_PROFILE = '/profile'

const PATH = {
  root: '/',
  auth: {
    login: '/login',
    register: '/register',
    logout: '/logout'
  },
  profile: {
    root: ROOT_PROFILE,
    changePassword: path(ROOT_PROFILE, '/change-password')
  },
  dashboard: {
    root: ROOT_DASHBOARD,
    analytics: path(ROOT_DASHBOARD, '/analytics'),
    song: {
      root: ROOT_SONG,
      create: path(ROOT_SONG, '/create'),
      edit: path(ROOT_SONG, 'modify/:slug/:id'),
      details: path(ROOT_SONG, '/:slug')
    },
    user: {
      root: ROOT_USER,
      // create: path(ROOT_SONG, '/create'),
      edit: path(ROOT_USER, '/edit'),
      details: path(ROOT_USER, '/:slug')
    },
    composer: {
      root: ROOT_COMPOSER,
      create: path(ROOT_COMPOSER, '/create'),
      edit: path(ROOT_COMPOSER, '/edit/:slug/:id'),
      details: path(ROOT_COMPOSER, '/:slug')
    },
    album: {
      root: ROOT_ALBUM,
      create: path(ROOT_ALBUM, '/create'),
      edit: path(ROOT_ALBUM, '/edit'),
      details: path(ROOT_ALBUM, '/:slug')
    },
    artist: {
      root: ROOT_ARTIST,
      create: path(ROOT_ARTIST, '/create'),
      edit: path(ROOT_ARTIST, '/edit'),
      details: path(ROOT_ARTIST, '/:slug')
    },
    category: {
      root: ROOT_CATEGORY,
      create: path(ROOT_CATEGORY, '/create'),
      edit: path(ROOT_CATEGORY, '/edit'),
      details: path(ROOT_CATEGORY, '/:slug')
    },
    tag: {
      root: ROOT_TAG,
      create: path(ROOT_TAG, '/create'),
      edit: path(ROOT_TAG, '/edit'),
      details: path(ROOT_TAG, '/:slug')
    },
    role: {
      root: ROOT_ROLE,
      create: path(ROOT_ROLE, '/create'),
      edit: path(ROOT_ROLE, '/edit'),
      details: path(ROOT_ROLE, '/:slug')
    }
  }
}

export default PATH
