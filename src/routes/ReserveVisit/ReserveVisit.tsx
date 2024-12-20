import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ReserveVisit.module.css";
import { useSupabase } from "../../contexts/SupabaseProvider";

interface Doctor {
    id: number;
    first_name: string;
    last_name: string;
}

const ReserveVisit: React.FC = () => {
    const supabase = useSupabase();
    const [searchQuery, setSearchQuery] = useState("");
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleSearch = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("doctor")
                    .select("id, first_name, last_name")
                    .ilike("last_name", `%${searchQuery}%`);

                if (error) {
                    console.error("Blad podczas wyszukiwania:", error.message);
                } else {
                    setDoctors(data);
                }
            } catch (err) {
                console.error("Nieoczekiwany blad:", err);
            } finally {
                setLoading(false);
            }
        };
        void handleSearch();
    }, [searchQuery, supabase]);

    return (
        <div className={styles.root}>
            <div className={styles.searchingFiltersContainer}>
                <div className={styles.searchingFiltersItem}>
                    <div>
                        <input
                            placeholder="Szukaj doktora po nazwisku..."
                            className={styles.searchBar}
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); }}
                        />
                    </div>
                </div>
                <div className={styles.searchingFiltersItem}>
                    <label
                        htmlFor="specialization"
                        className={styles.searchingFiltersLabel}
                    >
                        Lista specjalizacji:
                    </label>
                    <select
                        className={styles.select}
                        name="specialization"
                        id="specialization"
                    >
                        <option value="neuro">Neurolog</option>
                        <option value="orto">Ortopeda</option>
                        <option value="kardio">Kardiolog</option>
                        <option value="uro">Urolog</option>
                    </select>
                </div>
            </div>
            <h3>Wyniki wyszukiwania</h3>
            {!loading && doctors.length === 0 && searchQuery && (
                <p>Brak wynikow dla zapytania &quot;{searchQuery}&quot;.</p>
            )}
            <ul>
                {doctors.map(doctor => (
                    <Link key={doctor.id} to={`/doctor/${doctor.id.toString()}`}>
                        <li>
                            {doctor.first_name} {doctor.last_name}
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
};

export default ReserveVisit;
