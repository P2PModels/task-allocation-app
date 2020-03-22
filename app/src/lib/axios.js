import axios from 'axios'

const PORT = 5000
const baseURL = `http://localhost:${PORT}/api/`

const instance = axios.create({
  baseURL,
  headers: {
    'X-api-key': 'c68ac9f6a6cf18c84bb6a36853b24474fc309b2c',
  },
})

export default instance
