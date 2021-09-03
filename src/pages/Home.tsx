import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
  useIonAlert,
} from "@ionic/react";
import { useState } from "react";
import "./Home.css";

const Home: React.FC = () => {
  const BASE_URL = "<YOUR_LOCAL_TUNNEL_URL>";

  const [present] = useIonAlert();

  const submitHandler = async () => {};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="center">
            tru.ID Ionic / Capacitor Plugin
          </IonTitle>
        </IonToolbar>
      </IonHeader>
    </IonPage>
  );
};

export default Home;
