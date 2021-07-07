import { ReactNode } from 'react';
import '../styles/questions.scss';
import cx from 'classnames';

interface QuestionsProps {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children: ReactNode;
  isAnswered?: boolean;
  isHighLighted?: boolean;
}

export function Questions({
  content,
  author,
  children,
  isAnswered = false,
  isHighLighted = false,
}: QuestionsProps) {
  return (
    <section
      className={cx(
        'question',
        { answered: isAnswered },
        { highlighted: isHighLighted && !isAnswered },
      )}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </section>
  );
}
