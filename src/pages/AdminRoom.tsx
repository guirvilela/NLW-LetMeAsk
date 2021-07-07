import { useHistory, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteQuestionImg from '../assets/images/delete.svg';
import checkedImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { Questions } from '../components/Questions';
import { RoomCode } from '../components/RoomCode';
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
// import { database } from '../services/firebase';

import '../styles/room.scss';
import { database } from '../services/firebase';

interface Params {
  id: string;
}

export function AdminRoom() {
  // const { user } = useAuth();
  const { id } = useParams<Params>();
  const { questions, title } = useRoom(id);
  const history = useHistory();

  async function handleEndRoom() {
    await database.ref(`rooms/${id}`).update({
      endedAt: new Date(),
    });

    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${id}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestion(questionId: string) {
    await database.ref(`rooms/${id}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${id}/questions/${questionId}`).update({
      isHighLighted: true,
    });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="letmeAsk" />
          <div>
            <RoomCode code={id} />
            <Button isOutlined onClick={() => handleEndRoom()}>
              Encerrar Sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && (
            <span>
              {questions.length}{' '}
              {questions.length === 1 ? 'pergunta' : 'perguntas'}
            </span>
          )}
        </div>

        {questions.map((question) => (
          <Questions
            key={question.id}
            content={question.content}
            author={question.author}
            isAnswered={question.isAnswered}
            isHighLighted={question.isHighLighted}
          >
            {!question.isAnswered && (
              <>
                <button onClick={() => handleCheckQuestion(question.id)}>
                  <img src={checkedImg} alt="Marcar pergunta como respondida" />
                </button>
                <button onClick={() => handleHighlightQuestion(question.id)}>
                  <img src={answerImg} alt="Destacar pergunta" />
                </button>
              </>
            )}
            <button onClick={() => handleDeleteQuestion(question.id)}>
              <img src={deleteQuestionImg} alt="Remover Pergunta" />
            </button>
          </Questions>
        ))}
      </main>
    </div>
  );
}
