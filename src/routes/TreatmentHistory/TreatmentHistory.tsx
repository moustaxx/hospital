import { useEffect, useState } from "react";
import { useSupabase } from "../../contexts/SupabaseProvider";
import styles from "./TreatmentHistory.module.css";

const TreatmentHistory: React.FC = () => {
  const supabase = useSupabase();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

const fetchTreatmentHistory = async () => {
  try {
    const { data: patientRecords, error: patientRecordsError } = await supabase
      .from("patient_record")
      .select("id, diagnosis, diagnosis_date, patient_id, doctor_id")
      .eq("doctor_id", 21);

    if (patientRecordsError) throw patientRecordsError;

    const recordsWithDetails = await Promise.all(
      patientRecords?.map(async (record) => {
        const { data: patientData } = await supabase
          .from("patient")
          .select("first_name, last_name")
          .eq("id", record.patient_id)
          .single();

        const { data: doctorData } = await supabase
          .from("doctor")
          .select("first_name, last_name")
          .eq("id", record.doctor_id)
          .single();

        return {
          ...record,
          patient_name: `${patientData?.first_name} ${patientData?.last_name}`,
          doctor_name: `${doctorData?.first_name} ${doctorData?.last_name}`,
        };
      })
    );

    setHistory(recordsWithDetails || []);
  } catch (error) {
    setErrorMessage("Nie uda�o si� pobra� historii leczenia");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchTreatmentHistory();
  }, []);

  return (
    <div className={styles.root}>
      <h2>Historia Leczenia</h2>
      {loading ? (
        <p>�adowanie...</p>
      ) : errorMessage ? (
        <p style={{ color: "red" }}>{errorMessage}</p>
      ) : (
        <table className={styles.historyTable}>
          <thead>
            <tr>
              <th>Pacjent</th>
              <th>Doktor</th>
              <th>Diagnoza</th>
              <th>Data diagnozy</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record) => (
              <tr key={record.id}>
                <td>{record.patient_name}</td>
                <td>{record.doctor_name}</td>
                <td>{record.diagnosis}</td>
                <td>{record.diagnosis_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TreatmentHistory;
