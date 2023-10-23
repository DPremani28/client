import React, { useState } from 'react';
import axios from 'axios';
import cheerio from 'cheerio';


function ShoppingScraper() {
  const [keyword, setKeyword] = useState('');
  const [product, setProduct] = useState({});
  const [error, setError] = useState('');
  

  const scrapeGoogleAds = async () => {
    try {
        const apiKey='AIzaSyCbpc-mXW0NvahzEV0qqrwRXQl0PXK6Nkk';
        const response = await axios.get('http://www.googleapis.com/customsearch/v1?q=${req.query.keyword}&key=${apiKey}',{
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "*",
          "Access-Control-Allow-Origin":"*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Max-Age": 2592000,
            "Content-Type": "application/json"
        },
      });
      const $ = cheerio.load(response.data);

      
      const productTitle = $('h3').text();
      const price = $('.a-price .a-offscreen').text();
      const imageURL = $('.hlcw0c a img').attr('src');

      if (productTitle && price) {
        setProduct({ title: productTitle, price, imageURL });
      } else {
        setError('No shopping ads found for this keyword.');
      }
    } catch (error) {
      setError('Error occurred while scraping Google Shopping.');
    }
  };

  const convertToSpeech = () => {
    if (product.title) {
      const msg = new SpeechSynthesisUtterance();
      msg.text = `The price of ${product.title} is rupees ${product.price}`;
      window.speechSynthesis.speak(msg);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button onClick={scrapeGoogleAds}>Scrape Ads</button>
      <button onClick={convertToSpeech}>Convert to Speech</button>


      {error && <p>{error}</p>}
      {product.title && (
        <div>
          <p>The price of {product.title} is rupees {product.price}</p>
          <img src={product.imageURL} alt={product.title} />
        </div>
      )}
    </div>
  );
}

export default ShoppingScraper;
