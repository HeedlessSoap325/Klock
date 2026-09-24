# Klock

## Quickstart

### 1. Step: Install Java 17

Make sure you have **Java 17 installed** and yur JAVA_HOME is set to the bin path (it is easiest tu use sdkman).

Also make sure your **~/.gradle/gradle.properties** contains this:

```
org.gradle.java.home=$HOME/.sdkman/candidates/java/17.0.16-tem
```

### 2. Step: Install Android Studio

You must also install android Studio according to [this Guide](https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build&buildEnv=local#set-up-android-studio).

### 3. Step: Connect your phone

Connect your phone to your Computer using a USB calble capable of transfering data.

Enable USB Debugging on your Android Device using the [developer Settings](https://developer.android.com/studio/debug/dev-options).

Check for connectivity with this command:
```shell
adb devices
```

If you get a prompt on your phone, allow the connection from the computer.

expected output:

```
List of devices attached
xxxxxxxx        device
```

### 4. Step: Install on Android

Then you can simply run

```shell
npm run android:install
```