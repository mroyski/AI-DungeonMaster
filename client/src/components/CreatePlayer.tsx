import styles from './CreatePlayer.module.css';
import { useAuthContext } from '../lib/AuthContext';
import { playerClasses } from '../interfaces/Player.interface';
import { useRenderComponent } from '../lib/RenderComponentContext';
import { RenderComponentName } from '../constants';

const CreatePlayer: React.FC = () => {
  const { user } = useAuthContext();
  const { setActiveComponent } = useRenderComponent();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (user) {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/users/${user.id}/players`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        console.log('Player created successfully');
        setActiveComponent(RenderComponentName.PLAYER_SELECT);
        return;
      } else {
        console.error('Error creating player');
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.createPlayerForm}>
        <label htmlFor="name" className={styles.createPlayerLabel}>
          Name:
        </label>
        <input
          type="text"
          name="name"
          placeholder="name"
          required
          className={styles.createPlayerInput}
        />

        <label htmlFor="playerClass" className={styles.createPlayerLabel}>
          Class:
        </label>
        <select name="playerClass" required className={styles.createPlayerSelect}>
          {playerClasses.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>

        <button type="submit" className={styles.createPlayerButton}>
          Create Player
        </button>
      </form>
    </>
  );
};

export default CreatePlayer;
