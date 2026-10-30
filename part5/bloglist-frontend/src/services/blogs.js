import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const update = async (id, newObject) => {
  const request = await axios.put(`${baseUrl}/${id}`, newObject)
  return request.data
}

const create = async (newObject) => {
  const request = await axios.post(baseUrl, newObject)
  return request.data
}

const remove = async (id, config) => {
  await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, update, create, remove }
