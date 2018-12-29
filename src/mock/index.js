import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import data from './mock.data.js'

let mock = new MockAdapter(axios, { delayResponse: 80 })

mock.onGet('/notebooklist').reply(200, {
    data: data.notebooks
})

mock.onGet('/pagedata').reply(config => {
  let {bookid , tabid, pageid } = config.params;
  console.log("mock onGet: ", bookid , tabid, pageid) 
  data.pagedata.url = bookid + "/" + tabid + "/" + pageid
  return [200, {data: data.pagedata}]
}) 

mock.onGet('/users').reply(200, {
    data: data.users.slice(0, 10)
})
  
mock.onPost('/login').reply(200, {
    user: data.users[0],
    token: 'DFJ091283U09AODFUP018923U4J123J'
})
  
// for `index` action of resources
mock.onGet(/\/(posts|users|types|comments)$/).reply(({ params = { page: 1, perPage: 10 }, url }) => {
    let resource = url.split('/')[1]
    let offset = (params.page - 1) * params.perPage
    let models = data[resource]
    return [200, {
      currentPage: params.page,
      lastPage: Math.ceil(models.length / params.perPage),
      perPage: params.perPage,
      total: data[resource].length,
      data: models.slice(offset, offset + params.perPage)
    }]
})

export default mock