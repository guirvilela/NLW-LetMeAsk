import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import IllustrationImg from '../assets/images/illustration.svg';
import LogoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import '../styles/auth.scss';
import { Button } from '../components/Button';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    history.push('/rooms/new');
  }

  async function handleJoinRoom(e: FormEvent) {
    e.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('Room does not exists');
      return;
    }
    console.log(roomRef.val());

    if (roomRef.val().endedAt) {
      alert('Room already ended');
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={IllustrationImg} alt="Illustration" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={LogoImg} alt="Logo" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Logo Google" />
            Crie sua sala com o Google
          </button>
          <span className="separator">ou entre em uma sala</span>

          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Código da sala"
              onChange={(e) => setRoomCode(e.target.value)}
              value={roomCode}
            />
            <Button>Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
