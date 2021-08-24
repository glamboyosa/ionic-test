## tru-ionic-capacitor-plugin Example Project

## Requirements

- A physical Android or iOS mobile phone.
- [Ionic Tooling](https://ionicframework.com/docs/react/your-first-app#install-ionic-tooling)

Clone the repo via:

```bash
git clone https://github.com/tru-ID/ionic-plugin-example-app.git
```

Create a new tru.ID project in the root directory via:

```bash
tru projects:create example --project-dir .
```

If you want to create a tru.ID project with Sandbox mode enabled, for testing, run:

```bash
tru projects:create example --mode sandbox --project-dir
```

Read more about Sandbox mode [here](https://developer.tru.id/docs/sandbox)

## Starting the project

First, start the dev server by running in the root directory,

```bash
tru server -t
```

This will start a local development server and create a tunnel so that your phone application can communicate with the API. 

The `LocalTunnel` URL provided, copy this and update the following values with this URL:

* `capacitor.config.json` has a key: `url:` within the `server:` object, add the value here.
* `src/Home.tsx` has a constant called `BASE_URL`, add the value here.

To start the Ionic app , first install dependencies via:

```bash
npm install
```

The SDK is currently on the npm registry as `glamboytest` (for testing purposes)

Update `BASE_URL` in `Home.tsx` to the Localtunnel URL provided.

The next step is to sync the project for Android. In the terminal, run:

```bash
ionic build
ionic cap sync
ionic cap copy
```

Open the Android folder in Android Studio and let Gradle sync.

Run on your physical device.

To run on iOS, run the following in the terminal:

```bash
ionic build
ionic cap add ios
ionic cap sync
ionic cap copy
```

That will generate an ios folder, open it up in XCode and launch on a physical device.

### Note

Please note, Greg, that it may not `fetch` it may say "access to fetch at http://localhost is denied." Basically a CORS issue. If that happens , please just create a server , ideally clone our [Passwordless Registration](https://github.com/tru-ID/passwordless-auth-phonecheck) and add the previously created `tru.json` file to the root and run the server and simply update `BASE_URL` to the ngrok server.
