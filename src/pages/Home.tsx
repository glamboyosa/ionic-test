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
} from '@ionic/react';
import { useEffect, useState } from 'react';
import './Home.css';

import { TruPluginIonicCapacitor } from 'glamboytest';

const Home: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [checked, setChecked] = useState('');
  const [match, setMatch] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const BASE_URL = '<YOUR_LOCAL_TUNNEL_URL>';

  const [present] = useIonAlert();

  useEffect(() => {
    if (match === 'true') {
      present({
        cssClass: 'alert-style',
        header: 'Success!',
        message: 'PhoneCheck Verification successful.',
        buttons: ['Cancel', { text: 'Got It!' }],
        onDidDismiss: (e) => console.log('Alert Hook dismissed'),
      });
    } else if (match === 'false') {
      present({
        cssClass: 'alert-style',
        header: 'Something went wrong.',
        message: 'PhoneCheck verification unsuccessful.',
        buttons: ['Cancel', { text: 'Got It!' }],
        onDidDismiss: (e) => console.log('Alert Hook dismissed'),
      });
    }
  }, [match, present]);

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

      const resp: { check_id: string; check_url: string } =
        await response.json();

      console.log('Server response is: ', JSON.stringify(resp));

      const check_url = resp.check_url;
      const check_id = resp.check_id;

      console.log('check url is', check_url);

      console.log('check_id is', check_id);

      const isChecked = await TruPluginIonicCapacitor.check({ url: check_url });

      console.log(isChecked);

      console.log('isChecked (check) Result', isChecked.result);

      setChecked(JSON.stringify(isChecked));

      const phoneCheckResponse = await fetch(
        `${BASE_URL}/phone-check?check_id=${check_id}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const phoneCheckResult: { match: boolean } =
        await phoneCheckResponse.json();

      console.log('PhoneCheck match', phoneCheckResult.match);
      setMatch(JSON.stringify(phoneCheckResult.match));

      const reachabilityDetails = await TruPluginIonicCapacitor.isReachable();

      console.log('Reachability details are', reachabilityDetails.result);

      setDetails(JSON.stringify(reachabilityDetails));

      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(JSON.stringify(e));
      present({
        cssClass: 'alert-style',
        header: 'Something went wrong.',
        message: `${e.message}`,
        buttons: ['Cancel', { text: 'Got It!' }],
        onDidDismiss: (e) => console.log('Alert Hook dismissed'),
      });
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
          <IonItem className="center margin-top">
            <IonSpinner />
          </IonItem>
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

        {checked && <div>check function returns: {checked}</div>}
        {match && <div>we have a match? {match === 'true' ? 'Yes' : 'No'}</div>}
        {details && <div>reachabilityDetails are: {details}</div>}
      </IonContent>
    </IonPage>
  );
};

export default Home;
