// This file uses the older 'require' syntax to match node-fetch v2
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'API Key not set' }) 
    };
  }

  const t = Date.now();
  const urlEng = `https://gnews.io/api/v4/top-headlines?country=in&lang=en&max=6&token=${apiKey}&_=${t}`;
  const urlHin = `https://gnews.io/api/v4/top-headlines?country=in&lang=hi&max=6&token=${apiKey}&_=${t}`;

  try {
    const [respEng, respHin] = await Promise.all([
      fetch(urlEng).catch(e => null),
      fetch(urlHin).catch(e => null)
    ]);

    const dataEng = (respEng && respEng.ok) ? await respEng.json() : { articles: [] };
    const dataHin = (respHin && respHin.ok) ? await respHin.json() : { articles: [] };

    return {
      statusCode: 200,
      body: JSON.stringify({ eng: dataEng, hin: dataHin })
    };

  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};