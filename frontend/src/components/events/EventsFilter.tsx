import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconName } from '@fortawesome/fontawesome-svg-core';
import styles from './EventsFilter.module.css';
import useApi from '../../hooks/useApi';
import type { EventFilters } from '../../pages/home/HomePage';
import type { Sport, UserProfile } from '../../types/models';

const Filter = ({ icon, children }: { icon: IconName, children: React.ReactNode }) => (
    <div className={styles.filterItem}>
        <FontAwesomeIcon icon={icon} className={styles.icon} />
        <div className={styles.inputContent}>
            {children}
        </div>
    </div>
);


const RangeFilter = ({ label, valueDisplay, children }: { label: string, valueDisplay: string, children: React.ReactNode }) => (
    <div className={styles.rangeGroup}>
        <div className={styles.rangeHeader}>
            <span>{label}</span>
            <span className={styles.rangeValue}>{valueDisplay}</span>
        </div>
        {children}
    </div>
);

const CheckboxFilter = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (checked: boolean) => void }) => (
    <div className={styles.checkboxFilter}>
            <input 
                type="checkbox" 
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                id={label}
                />
        <label htmlFor={label}>{label}</label>
    </div>
);

const EventsFilter = ({ setFilters }: { setFilters: (filters: EventFilters) => void }) => {
    const { data: sports } = useApi<Sport[]>('/sports');
    const { data: user } = useApi<UserProfile>('/users/me');

    const [showMoreOptions, setShowMoreOptions] = useState(false);

    // Filter states
    const [sport, setSport] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [radius, setRadius] = useState<number>(10);
    const [ageMin, setAgeMin] = useState<number>(18);
    const [ageMax, setAgeMax] = useState<number>(60);
    const [gender, setGender] = useState<string>('');
    const [passed, setPassed] = useState<boolean>(false);
    const [full, setFull] = useState<boolean>(false);

    // Load sports
    useEffect(() => {
        if (sports && sports.length > 0 && !sport) {
            setSport(sports[0]._id);
        }
    }, [sports]);

    // Set defaults from user profile
    useEffect(() => {
        if (user) {
            if (user.city) setCity(user.city);
            if (user.sports && user.sports.length > 0) {
                setSport(user.sports[0]._id);
            }
        }
    }, [user]);

    // AI-ASSISTED : Double Slider Logic
    const getPercent = (value: number) => Math.round(((value - 18) / (99 - 18)) * 100);

    // Refs for double slider
    const minValRef = useRef(ageMin);
    const maxValRef = useRef(ageMax);
    const range = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const minPercent = getPercent(ageMin);
        const maxPercent = getPercent(maxValRef.current);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [ageMin, getPercent]);

    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(ageMax);

        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [ageMax, getPercent]);

    const handleSearch = () => {
        setShowMoreOptions(false);

        const filters: EventFilters = {
            timestamp: Date.now()
        };

        if (sport) filters.sport = sport;
        if (city) filters.city = city;
        if (date) filters.date = date;
        
        filters.radius = radius;
        filters.ageMin = ageMin;
        filters.ageMax = ageMax;
        if (gender) filters.gender = gender;
        filters.passed = passed;
        filters.full = full;

        setFilters(filters);
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainFilters}>
                {/* Sport */}
                <Filter icon={sports?.find(s => s._id === sport)?.icon || 'heart-pulse'}>
                    <select 
                        className={styles.select}
                        value={sport}
                        onChange={(e) => setSport(e.target.value)}
                    >
                        <option value="">Tous les sports</option>
                        {sports?.map((s) => (
                            <option key={s._id} value={s._id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </Filter>

                <div className={styles.divider}></div>

                {/* Ville */}
                <Filter icon={'map-marker-alt'}>
                    <input 
                        type="text" 
                        className={styles.input}
                        placeholder="Ville..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </Filter>

                <div className={styles.divider}></div>

                {/* Date */}
                <Filter icon={'calendar-alt'}>
                    <input 
                        type="date" 
                        className={styles.input}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </Filter>
            </div>

            <div className={styles.divider}></div>

            {/* Plus d'options */}
            <div className={styles.actions}>
                <button 
                    className={styles.moreOptionsBtn}
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                >
                    {showMoreOptions ? 'Moins d\'options' : 'Plus d\'options'}
                </button>

                {showMoreOptions && (
                    <div className={styles.expandedOptions}>
                        {/* Rayon */}
                        <RangeFilter label="Rayon" valueDisplay={`${radius} km`}>
                            <input 
                                type="range" 
                                min="1" 
                                max="100" 
                                value={radius} 
                                className={styles.rangeInput}
                                onChange={(e) => setRadius(Number(e.target.value))}
                            />
                        </RangeFilter>

                        {/* Age (AI-ASSISTED : Double slider) */}
                        <RangeFilter label="Âge" valueDisplay={`${ageMin} - ${ageMax} ans`}>
                            <div className={styles.doubleSliderContainer}>
                                <input
                                    type="range"
                                    min="18"
                                    max="99"
                                    value={ageMin}
                                    onChange={(event) => {
                                        const value = Math.min(Number(event.target.value), ageMax - 1);
                                        setAgeMin(value);
                                        minValRef.current = value;
                                    }}
                                    className={`${styles.thumb} ${styles.thumbLeft}`}
                                    style={{ zIndex: ageMin > 99 - 10 ? 5 : undefined }}
                                />
                                <input
                                    type="range"
                                    min="18"
                                    max="99"
                                    value={ageMax}
                                    onChange={(event) => {
                                        const value = Math.max(Number(event.target.value), ageMin + 1);
                                        setAgeMax(value);
                                        maxValRef.current = value;
                                    }}
                                    className={`${styles.thumb} ${styles.thumbRight}`}
                                />
                                <div className={styles.slider}>
                                    <div className={styles.sliderTrack} />
                                    <div ref={range} className={styles.sliderRange} />
                                </div>
                            </div>
                        </RangeFilter>

                        {/* Genre */}
                        <Filter icon={
                            gender == 'male' ? 'mars' 
                            : gender == 'female' ? 'venus' 
                            : 'venus-mars'
                        }>
                            <select 
                                className={styles.select}
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="">Mixte</option>
                                <option value="male">Hommes</option>
                                <option value="female">Femmes</option>
                            </select>
                        </Filter>

                        {/* Passés */}
                        <CheckboxFilter 
                            label="Événements passés"
                            checked={passed} 
                            onChange={setPassed} 
                        />

                        {/* Complets */}
                        <CheckboxFilter 
                            label="Événements complets" 
                            checked={full} 
                            onChange={setFull} 
                        />
                    </div>
                )}

                <button className={styles.searchButton} onClick={handleSearch}>
                    Rechercher
                </button>
            </div>
        </div>
    );
};

export default EventsFilter;
