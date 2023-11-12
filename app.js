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

      if (!home) {
        // laisser vide
      }
      if (!meta) {
        meta = { data: { title: 'mathiso - Portfolio', description: 'Description par défaut' } }
      }

      res.render('pages/home', {
        home,
        meta
      })
    })
  })
})

// ...

app.get('/about', (req, res) => {
  initApi(req).then(api => {
    api.query(Prismic.Predicates.any('document.type', ['about', 'meta'])).then(response => {
      const about = response.results.find(doc => doc.type === 'about')
      let meta = response.results.find(doc => doc.type === 'meta')

      if (!about) {
        // laisser vide
      }
      if (!meta) {
        meta = { data: { title: 'Titre par défaut', description: 'Description par défaut' } }
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

      if (!contact) {
        // laisser vide
      }
      if (!meta) {
        meta = { data: { title: 'Titre par défaut', description: 'Description par défaut' } }
      }

      res.render('pages/contact', {
        contact,
        meta
      })
    })
  })
})

app.get('/works', (req, res) => {
  initApi(req).then(api => {
    api.query(Prismic.Predicates.any('document.type', ['wroks', 'meta'])).then(response => {
      const works = response.results.find(doc => doc.type === 'works')
      let meta = response.results.find(doc => doc.type === 'meta')

      if (!works) {
        // laisser vide
      }
      if (!meta) {
        meta = { data: { title: 'Titre par défaut', description: 'Description par défaut' } }
      }

      res.render('pages/works', {
        works,
        meta
      })
    })
  })
})

app.get('/details:uid', (req, res) => {
  initApi(req).then(api => {
    api.query(Prismic.Predicates.any('document.type', ['details', 'meta'])).then(response => {
      const details = response.results.find(doc => doc.type === 'details')
      let meta = response.results.find(doc => doc.type === 'meta')

      if (!details) {
        // laisser vide
      }
      if (!meta) {
        meta = { data: { title: 'Titre par défaut', description: 'Description par défaut' } }
      }

      res.render('pages/details', {
        details,
        meta
      })
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at localhost:${port}`)
})
