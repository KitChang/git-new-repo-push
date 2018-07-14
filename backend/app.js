const express = require('express');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Header',
    'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.use('/api/posts', (req, res, next) => {
  const posts = [
    { id: '321', title: 'first', content: 'first content'},
    { id: 'fdsa', title: '2nd', content: 'second post'}
  ];

  res.status(200).json({
    message: 'ok',
    posts: posts
  });
});

module.exports = app;
