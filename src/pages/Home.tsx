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

import { TruPluginIonicCapacitor } from "@tru_id/tru-plugin-ionic-capacitor";

const Home: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checked, setChecked] = useState("");
  const [match, setMatch] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const BASE_URL = "<YOUR_NGROK_OR_LOCAL_TUNNEL_URL>";
  
  const [present] = useIonAlert();

  const submitHandler = async () => {
    const body = JSON.stringify({ phone_number: phoneNumber });
    console.log(body);
    try {
      setLoading(true);
      const reachabilityDetails = await TruPluginIonicCapacitor.isReachable();

      console.log("Reachability details are", reachabilityDetails.result);

      const info: {
        network_id: string;
        network_name: string;
        country_code: string;
        products?: { product_id: string; product_name: string }[];
        error?: {
          type: string;
          title: string;
          status: number;
          detail: string;
        };
      } = JSON.parse(reachabilityDetails.result);

      if (info.error?.status === 400) {
        present({
          cssClass: "alert-style",
          header: "Something went wrong.",
          message: "Mobile Operator not supported.",
          buttons: ["Cancel", { text: "Got It!" }],
          onDidDismiss: (e) => console.log("Alert Hook dismissed"),
        });

        setDetails("MNO not supported");
        setLoading(false);
        return;
      }

      let isPhoneCheckSupported = false;

      if (info.error?.status !== 412) {
        isPhoneCheckSupported = false;

        for (const { product_name } of info.products!) {
          console.log("supported products are", product_name);

          if (product_name === "Phone Check") {
            isPhoneCheckSupported = true;
          }
        }
      } else {
        isPhoneCheckSupported = true;
      }

      if (!isPhoneCheckSupported) {
        present({
          cssClass: "alert-style",
          header: "Something went wrong.",
          message: "PhoneCheck is not supported on MNO.",
          buttons: ["Cancel", { text: "Got It!" }],
          onDidDismiss: (e) => console.log("Alert Hook dismissed"),
        });
        setDetails("PhoneCheck is not supported on MNO");
        setLoading(false);
        return;
      }

      setDetails(JSON.stringify(isPhoneCheckSupported));

      const response = await fetch(`${BASE_URL}/phone-check`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body,
      });

      const resp: { check_id: string; check_url: string } =
        await response.json();

      console.log("Server response is: ", JSON.stringify(resp));

      const check_url = resp.check_url;
      const check_id = resp.check_id;

      console.log("check url is", check_url);

      console.log("check_id is", check_id);

      const isChecked = await TruPluginIonicCapacitor.check({ url: check_url });

      console.log(isChecked);

      console.log("isChecked (check) Result", isChecked.result);

      setChecked(JSON.stringify(isChecked));

      const phoneCheckResponse = await fetch(
        `${BASE_URL}/phone-check?check_id=${check_id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const phoneCheckResult: { match: boolean } =
        await phoneCheckResponse.json();

      console.log("PhoneCheck match", phoneCheckResult.match);
      setMatch(JSON.stringify(phoneCheckResult.match));

      setLoading(false);
      if (phoneCheckResult.match) {
        present({
          cssClass: "alert-style",
          header: "Success!",
          message: "PhoneCheck Verification successful.",
          buttons: ["Cancel", { text: "Got It!" }],
          onDidDismiss: (e) => console.log("Alert Hook dismissed"),
        });
      } else if (!phoneCheckResult.match) {
        present({
          cssClass: "alert-style",
          header: "Something went wrong.",
          message: "PhoneCheck verification unsuccessful.",
          buttons: ["Cancel", { text: "Got It!" }],
          onDidDismiss: (e) => console.log("Alert Hook dismissed"),
        });
      }
    } catch (e: any) {
      setLoading(false);
      console.log(JSON.stringify(e));
      present({
        cssClass: "alert-style",
        header: "Something went wrong.",
        message: `${e.message}`,
        buttons: ["Cancel", { text: "Got It!" }],
        onDidDismiss: (e) => console.log("Alert Hook dismissed"),
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
          <div className="center margin-top">
            <IonSpinner />
          </div>
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
        {details && <div>isReachable? : {details === "true" ? "✔" : "No"}</div>}
        {checked && <div>Check URL opened ✔</div>}
        {match && <div>We have a match? {match === "true" ? "✔" : "No"}</div>}
      </IonContent>
    </IonPage>
  );
};

export default Home;
