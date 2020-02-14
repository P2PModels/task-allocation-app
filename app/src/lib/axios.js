import axios from 'axios'

const instance = axios.create({
  // baseURL: '',
  headers: {
    'X-api-key': 'd6dfe8b06704020e3280559e55905e0e9a24d735',
    'X-api-username': 'paulo_colombo',
    Authorization: 'Bearer fde8016c-770b-4619-a5e3-d66d9160fce5',
  },
})

export default instance
