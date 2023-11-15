require('dotenv').config()

const express = require('express')
const app = express()
const path = require('path')
const port = 3000

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')

const initApi = req => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
  })
}

const handleLinkResolver = doc => {
  //  if (doc.type === 'page') {
  //  return '/page/' + doc.uid
  //  } else if (doc.type === 'blog_post') {
  //  return '/blog/' + doc.uid
  //  }
  return '/'
}

app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkresolver: handleLinkResolver
  }

  res.locals.PrismicDOM = PrismicDOM

  next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  initApi(req).then(api => {
    api.query(Prismic.Predicates.any('document.type', ['home', 'meta'])).then(response => {
      const home = response.results.find(doc => doc.type === 'home')
      let meta = response.results.find(doc => doc.type === 'meta')

      if (!meta) {
        meta = { data: { title: 'mathiso - Portfolio', description: 'Jeune amateur de sites web créatifs et attranyants' } }
      }

      res.render('pages/home', {
        home,
        meta
      })
    })
  })
})

app.get('/about', (req, res) => {
  initApi(req).then(api => {
    api.query(Prismic.Predicates.any('document.type', ['about', 'meta'])).then(response => {
      const about = response.results.find(doc => doc.type === 'about')
      let meta = response.results.find(doc => doc.type === 'meta')

      if (!meta) {
        meta = { data: { title: 'mathiso - Portfolio', description: 'Jeune amateur de sites web créatifs et attranyants' } }
      }

      res.render('pages/about', {
        about,
        meta
      })
    })
  })
})

app.get('/contact', (req, res) => {
  initApi(req).then(api => {
    api.query(Prismic.Predicates.any('document.type', ['contact', 'meta'])).then(response => {
      const contact = response.results.find(doc => doc.type === 'contact')
      let meta = response.results.find(doc => doc.type === 'meta')

      if (!meta) {
        meta = { data: { title: 'mathiso - Portfolio', description: 'Jeune amateur de sites web créatifs et attranyants' } }
      }

      res.render('pages/contact', {
        contact,
        meta
      })
    })
  })
})

app.get('/works', async (req, res) => {
  const api = await initApi(req)
  let meta = await api.getSingle('meta')
  const home = await api.getSingle('home')
  const { results: works } = await api.query(Prismic.Predicates.at('document.type', 'works'), {
    fetchLinks: 'product.image'
  })

  if (!meta) {
    meta = { data: { title: 'mathiso - Portfolio', description: 'Jeune amateur de sites web créatifs et attrayants' } }
  }

  res.render('pages/works', {
    works,
    home,
    meta
  })
})

app.get('/details/:uid', async (req, res) => {
  const api = await initApi(req)
  api.query(Prismic.Predicates.any('document.type', ['product', 'meta'])).then(async response => {
    const product = await api.getByUID('product', req.params.uid, {
      fetchLinks: 'product.title'
    })
    let meta = response.results.find(doc => doc.type === 'meta')

    if (!meta) {
      meta = { data: { title: 'mathiso - Portfolio', description: 'Jeune amateur de sites web créatifs et attranyants' } }
    }

    res.render('pages/details', {
      meta,
      product
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at localhost:${port}`)
})
