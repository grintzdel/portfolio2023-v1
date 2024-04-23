require('dotenv').config()

const logger = require('morgan')
const express = require('express')
const errorHandler = require('errorhandler')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')

const app = express()
const path = require('path')
const port = 3000

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())
app.use(errorHandler())
app.use(express.static(path.join(__dirname, 'public')))

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')
const UAParser = require('ua-parser-js')

/**
 * Initializes the Prismic API.
 *
 * @param {Object} req - The Express request object.
 * @returns {Object} The Prismic API object.
 */
const initApi = req => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
  })
}

/**
 * Resolves the link for a given Prismic document.
 *
 * @param {Object} doc - The Prismic document.
 * @returns {string} The URL for the document.
 */
const handleLinkResolver = doc => {
  if (doc.type === 'product') {
    return '/details/' + doc.uid
  }

  if (doc.type === 'collections') {
    return '/works'
  }

  if (doc.type === 'about') {
    return '/about'
  }

  return '/'
}

/**
 * Middleware function that sets up local variables for the response object.
 * These variables are available to the view during the request-response cycle.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 */
app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkresolver: handleLinkResolver
  }

  const ua = UAParser(req.headers['user-agent'])

  res.locals.isDesktop = ua.device.type === undefined
  res.locals.isMobile = ua.device.type === 'mobile'
  res.locals.isTablet = ua.device.type === 'tablet'

  res.locals.Link = handleLinkResolver
  res.locals.PrismicDOM = PrismicDOM

  next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

/**
 * Route handler for the root URL ("/") of the application.
 * When a GET request is made to the root URL, this function is executed.
 * It initializes the Prismic API and queries for documents of type 'home' or 'meta'.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
/**
 * Initializes the Prismic API and queries for documents of type 'home' or 'meta'.
 *
 * @param {Object} api - The Prismic API object.
 */
app.get('/', (req, res) => {
  initApi(req).then(api => {
    api.query(Prismic.Predicates.any('document.type', ['home', 'meta'])).then(async response => {
      const home = response.results.find(doc => doc.type === 'home')
      let meta = response.results.find(doc => doc.type === 'meta')
      const navigation = await api.getSingle('navigation')
      const preloader = await api.getSingle('preloader')

      const { results: works } = await api.query(Prismic.Predicates.at('document.type', 'works'), {
        fetchLinks: 'product.image'
      })

      if (!meta) {
        meta = {
          data: {
            title: 'mathiso - Portfolio',
            description: 'Jeune amateur de sites web créatifs et attranyants'
          }
        }
      }

      res.render('pages/home', {
        navigation,
        works,
        home,
        meta,
        preloader
      })
    })
  })
})

app.get('/about', (req, res) => {
  initApi(req).then(api => {
    api.query(Prismic.Predicates.any('document.type', ['about', 'meta'])).then(async response => {
      const about = response.results.find(doc => doc.type === 'about')
      let meta = response.results.find(doc => doc.type === 'meta')
      const navigation = await api.getSingle('navigation')
      const preloader = await api.getSingle('preloader')

      if (!meta) {
        meta = {
          data: {
            title: 'mathiso - Portfolio',
            description: 'Jeune amateur de sites web créatifs et attranyants'
          }
        }
      }

      res.render('pages/about', {
        navigation,
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
  const navigation = await api.getSingle('navigation')

  const { results: works } = await api.query(Prismic.Predicates.at('document.type', 'works'), {
    fetchLinks: 'product.image'
  })

  if (!meta) {
    meta = {
      data: {
        title: 'mathiso - Portfolio',
        description: 'Jeune amateur de sites web créatifs et attrayants'
      }
    }
  }

  res.render('pages/works', {
    navigation,
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
    const navigation = await api.getSingle('navigation')

    const product = await api.getByUID('product', req.params.uid, {
      fetchLinks: 'product.title'
    })
    let meta = response.results.find(doc => doc.type === 'meta')

    if (!meta) {
      meta = {
        data: {
          title: 'mathiso - Portfolio',
          description: 'Jeune amateur de sites web créatifs et attranyants'
        }
      }
    }

    res.render('pages/details', {
      navigation,
      meta,
      product,
      preloader
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at localhost:${port}`)
})
