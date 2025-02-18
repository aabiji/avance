# Avance

TODO: what should EXPO_PUBLIC_HOST be in the production build of the app?

A fitness app to track your weight and exercises. Avance is
designed to be offline-first, with an optional self hosted
backend. Currently, Avance has only been tested on Android,
but since it's built with React Native, it should work cross
platform.

### Setup
To build and run the app, ensure you have Android Studio,
Docker, and Bun installed.

**Deploy the backend**
```bash
mkdir secrets
echo "Super secret secret" > secrets/jwt_secret.txt
echo "Super secret password" > secrets/postgres_password.txt
sudo docker compose up
```

**Run the app's development build**
```bash
export EXPO_PUBLIC_HOST="Your ip address"
bun install
bunx expo start
```

**Build the Android APK**
```bash
bunx expo prebuild
cd android
./gradlew assembleRelease
```

Avance is open source under the MIT license. Contributions are welcome!