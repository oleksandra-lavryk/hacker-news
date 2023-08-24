import { useEffect, useState } from 'react';
import LoadingRing from './LoadingRing';
import NewsItem from './NewsItem';
import { News } from './../interfaces';
import './../styles/News.scss';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0/';

const NewsList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [newsList, setNewsList] = useState<News[]>([]);

  const getUserKarmaByName = async (userName: News['by']) => {
    const responseUser = await fetch(`${BASE_URL}user/${userName}.json`);
    const jsonUser = await responseUser.json();
    return jsonUser.karma;
  };

  const getNewsById = async (newsId: News['id']) => {
    const responseNews = await fetch(`${BASE_URL}item/${newsId}.json`);
    const jsonNews = await responseNews.json();
    return jsonNews;
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(`${BASE_URL}topstories.json`)
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
            const randomNews = await getNewsById(newsId);
            randomNews['karma'] = await getUserKarmaByName(randomNews.by);
            randomNewsToShow.push(randomNews);
          }
          const sortedList = randomNewsToShow.sort(
            (firstItem, secondItem) => firstItem.score - secondItem.score
          );
          setNewsList(sortedList);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  }, []);

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
        <div className='cards-wrapper'>
          {newsList.map((news) => (
            <NewsItem news={news} key={news.id} />
          ))}
        </div>
      )}
    </>
  );
};

export default NewsList;
