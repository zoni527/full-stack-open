import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => axios.get(baseUrl).then(resp => resp.data)

const create = newObject => axios.post(baseUrl, newObject).then(resp => resp.data)

const update = (id, newObject) => axios.put(`${baseUrl}/${id}`, newObject).then(resp => resp.data)

const deleteId = id => axios.delete(`${baseUrl}/${id}`).then(resp => console.log(resp))

export default { getAll, create, update, deleteId }
