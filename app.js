require('dotenv').config()

const logger = require('morgan')
const express = require('express')
const erroHandler = require('errorhandler')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')

const app = express()
const path = require('path')
const port = 3000

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())
app.use(erroHandler())

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

  res.locals.Links = handleLinkResolver
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
    api.query(Prismic.Predicates.any('document.type', ['about', 'meta'])).then(async response => {
      const about = response.results.find(doc => doc.type === 'about')
      let meta = response.results.find(doc => doc.type === 'meta')
      const preloader = await api.getSingle('preloader')

      if (!meta) {
        meta = { data: { title: 'mathiso - Portfolio', description: 'Jeune amateur de sites web créatifs et attranyants' } }
      }

      res.render('pages/about', {
        about,
        meta,
        preloader
      })
    })
  })
})

app.get('/works', async (req, res) => {
  const api = await initApi(req)
  let meta = await api.getSingle('meta')
  const home = await api.getSingle('home')
  const preloader = await api.getSingle('preloader')

  const { results: works } = await api.query(Prismic.Predicates.at('document.type', 'works'), {
    fetchLinks: 'product.image'
  })

  if (!meta) {
    meta = { data: { title: 'mathiso - Portfolio', description: 'Jeune amateur de sites web créatifs et attrayants' } }
  }

  res.render('pages/works', {
    works,
    home,
    meta,
    preloader
  })
})

app.get('/details/:uid', async (req, res) => {
  const api = await initApi(req)

  api.query(Prismic.Predicates.any('document.type', ['product', 'meta'])).then(async response => {
    const preloader = await api.getSingle('preloader')
    const product = await api.getByUID('product', req.params.uid, {
      fetchLinks: 'product.title'
    })
    let meta = response.results.find(doc => doc.type === 'meta')

    if (!meta) {
      meta = { data: { title: 'mathiso - Portfolio', description: 'Jeune amateur de sites web créatifs et attranyants' } }
    }

    res.render('pages/details', {
      meta,
      product,
      preloader
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at localhost:${port}`)
})
