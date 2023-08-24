import { useEffect, useState } from 'react';
import LoadingRing from './LoadingRing';
import NewsItem from './NewsItem';
import { News } from './../interfaces';
import './../styles/News.scss';

const NewsList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [newsList, setNewsList] = useState<News[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error('Fetching failed');
        }
      })
      .then(async (result) => {
        if (result.length) {
          let randomNewsToShow: Array<News> = [];
          for (let index = 0; index < 10; index++) {
            let newsId: number =
              result[Math.floor(Math.random() * result.length)];
            const responseNews = await fetch(
              `https://hacker-news.firebaseio.com/v0/item/${newsId}.json`
            );
            const jsonNews = await responseNews.json();

            const responseUser = await fetch(
              `https://hacker-news.firebaseio.com/v0/user/${jsonNews.by}.json`
            );
            const jsonUser = await responseUser.json();
            jsonNews['karma'] = jsonUser.karma;
            randomNewsToShow.push(jsonNews);
          }

          setNewsList(
            randomNewsToShow.sort(
              (firstItem, secondItem) => firstItem.score - secondItem.score
            )
          );
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    console.log(newsList);
  }, [newsList]);

  return (
    <>
      <h1>Hacker News</h1>
      {isLoading && (
        <>
          <h3>
            Please wait. We are looking for interesting stories for you...
          </h3>
          <LoadingRing />
        </>
      )}
      {!isLoading && newsList.length === 0 && (
        <p>Sorry, no news found. Please try later. </p>
      )}
      {!isLoading && newsList.length !== 0 && (
        <>
          <div className='cards-wrapper'>
            {newsList.map((news) => (
              <NewsItem news={news} key={news.id} />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default NewsList;
