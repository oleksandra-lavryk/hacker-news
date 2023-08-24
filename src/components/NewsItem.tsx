import { useEffect } from 'react';
import { News } from './../interfaces';
import './../styles/News.scss';
import { ReactComponent as Star } from './../images/star.svg';
import { ReactComponent as User } from './../images/user.svg';

const NewsItem: React.FC<{
  news: News;
}> = ({ news }) => {
  const formatedDate = new Date(news.time * 1000).toLocaleDateString('en-UK');

  useEffect(() => {}, []);

  return (
    <div className='cards-wrapper__item'>
      <div className='image'>
        <img src={require('./../images/news-image.png')} />
      </div>
      <div className='score'>
        {' '}
        <span>{news.score}</span>
      </div>
      <a href={news.url} target='_blank'>
        {news.title}
      </a>
      <div className='footer'>
        <div className='author'>
          <User className='user' />
          <span>{news.by}</span>
          <Star />
          <span>{news.karma}</span>
        </div>
        <div className='time'>{formatedDate}</div>
      </div>
    </div>
  );
};

export default NewsItem;
