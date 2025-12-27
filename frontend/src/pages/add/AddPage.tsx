import styles from './AddPage.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useApi from '../../hooks/useApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconName } from '@fortawesome/free-solid-svg-icons';
import type { Sport } from '../../types/models';

const AddPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [sportId, setSportId] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [max, setMax] = useState(null as number | null);
  const [description, setDescription] = useState('');

  const { auth } = useAuth();
  const userId = auth?.user?.id;

  const { data: sports, loading: sportsLoading } = useApi<Sport[]>('/sports/');

  const { execute: createEvent, loading: submitting, error: submitError } = useApi('/events/', {
    method: 'POST',
    autoRun: false
  });

  // Sélectionne le premier sport par défaut une fois les sports chargés
  useEffect(() => {
    if (sports && sports.length > 0 && !sportId) {
      setSportId(sports[0]._id);
    }
  }, [sports]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createEvent({
        user: userId,
        title,
        sport: sportId,
        location,
        date,
        max,
        description,
        // medias
      });
      navigate('/');
    } catch (err) {
      console.error("Failed to create event", err);
    }
  };

  return (
    <div className={styles.addPage}>
      <div className={styles.container}>
        {/* Media Upload Placeholder */}
        <div className={styles.imageUpload}>
          <div className={styles.plusIcon}>
            <FontAwesomeIcon icon='plus' />
            {/* TODO : upload media */}
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Titre */}
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Titre"
              className={`${styles.input} ${styles.inputNoIcon}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Sport */}
          <div className={styles.inputGroup}>
            <FontAwesomeIcon icon={sports?.find(s => s._id === sportId)?.icon || 'heart-pulse'} className={styles.icon} />
                    
            <select 
              className={styles.select}
              value={sportId}
              onChange={(e) => setSportId(e.target.value)}
              disabled={sportsLoading}
            >
              {sportsLoading ? (
                <option>Chargement...</option>
              ) : (
                sports?.map((sport) => (
                  <option key={sport._id} value={sport._id}>{sport.name}</option>
                ))
              )}
            </select>
          </div>

          {/* Lieu */}
          <div className={styles.inputGroup}>
            <FontAwesomeIcon icon='map-marker-alt' className={styles.icon} />
            <input
              type="text"
              placeholder="Lieu"
              className={styles.input}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* Date */}
          <div className={styles.inputGroup}>
            <FontAwesomeIcon icon='calendar-alt' className={styles.icon} />
            <input
              type="datetime-local"
              placeholder="Date"
              className={styles.input}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Max */}
          <div className={styles.inputGroup}>
            <FontAwesomeIcon icon='users' className={styles.icon} />
            <input
              type="number"
              min="0"
              max="max"
              placeholder="Max participants"
              className={styles.input}
              value={max !== null ? max : ''}
              onChange={(e) => setMax(e.target.value ? Number(e.target.value) : null)}
            />
          </div>

          {/* Description */}
          <textarea
            placeholder="Description..."
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {submitError && <p className={styles.error}>Une erreur est survenue. {submitError.message}</p>}

          {/* Publier */}
          <button type="submit" className={styles.submitButton} disabled={submitting}>
            {submitting ? 'Publication...' : 'Publier'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPage;
