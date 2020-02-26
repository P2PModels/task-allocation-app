import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:4000/',
  headers: {
    'X-api-key': 'c68ac9f6a6cf18c84bb6a36853b24474fc309b2c',
  },
})

export default instance
