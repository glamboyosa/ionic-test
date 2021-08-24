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
} from '@ionic/react';
import { useState } from 'react';
import './Home.css';

import { TruPluginIonicCapacitor } from 'glamboytest';

const Home: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [checked, setChecked] = useState('');
  const [match, setMatch] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const BASE_URL = '<YOUR_LOCAL_TUNNEL_URL>';

  const submitHandler = async () => {
    const body = JSON.stringify({ phone_number: phoneNumber });
    console.log(body);
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/phone-check`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body,
      });

      const resp: { data: { checkId: string; checkUrl: string } } =
        await response.json();

      console.log('Server response is: ', resp);

      const isChecked = await TruPluginIonicCapacitor.check(resp.data.checkUrl);

      console.log(isChecked);
      console.log('isChecked (check) Result', isChecked.result);
      setChecked(JSON.stringify(isChecked));

      const phoneCheckResponse = await fetch(
        `${BASE_URL}/phone-check?check_id=${resp.data.checkId}`
      );

      const phoneCheckResult: { data: { match: boolean } } =
        await phoneCheckResponse.json();

      console.log('PhoneCheck match', phoneCheckResult.data.match);
      setMatch(JSON.stringify(phoneCheckResult.data.match));

      const reachabilityDetails = await TruPluginIonicCapacitor.isReachable();

      console.log('Reachability details are', reachabilityDetails.result);

      setDetails(JSON.stringify(reachabilityDetails));
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(JSON.stringify(e));
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="center">
            tru.ID Ionic / Capacitor Plugin
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonItem className="center margin-top">
          <IonInput
            value={phoneNumber}
            className="input"
            autocapitalize="off"
            type="tel"
            placeholder="Phone Number ex. +4433234454"
            onIonChange={(e) => setPhoneNumber(e.detail.value!)}
            clearInput
          ></IonInput>
        </IonItem>
        {loading ? (
          <IonSpinner />
        ) : (
          <IonButton
            expand="block"
            color="success"
            shape="round"
            onClick={submitHandler}
          >
            Submit
          </IonButton>
        )}

        {checked && <div>check function returns? {checked}</div>}
        {match && <div>we have a match ?{match}</div>}
        {details && <div>reachabilityDetails ? {details}</div>}
      </IonContent>
    </IonPage>
  );
};

export default Home;
