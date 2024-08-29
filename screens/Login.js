import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, ScrollView, KeyboardAvoidingView, Platform, Animated } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import Ionicons from 'react-native-vector-icons/Ionicons';

const backImage = require("../assets/backImage.png");
const googleIcon = require("../assets/google.png");
const facebookIcon = require("../assets/facebook.png");
const appleIcon = require("../assets/apple.png");
const loginLogo = require("../assets/logo.png");

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const buttonWidth = useRef(new Animated.Value(300)).current; // Ancho inicial del botón
  const buttonHeight = useRef(new Animated.Value(58)).current; // Altura inicial del botón
  const borderRadius = useRef(new Animated.Value(10)).current; // Radio inicial del botón

  const emailShake = useRef(new Animated.Value(0)).current;
  const passwordShake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loginSuccess) {
      Animated.parallel([
        Animated.timing(buttonWidth, {
          toValue: 58, // Nuevo ancho del botón
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(buttonHeight, {
          toValue: 58, // Nueva altura del botón
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(borderRadius, {
          toValue: 29, // Nuevo radio del botón (círculo)
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [loginSuccess]);

  useEffect(() => {
    if (emailError || passwordError) {
      Animated.sequence([
        Animated.timing(emailShake, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(emailShake, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(emailShake, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(emailShake, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.sequence([
        Animated.timing(passwordShake, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(passwordShake, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(passwordShake, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(passwordShake, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [emailError, passwordError]);

  const onHandleLogin = () => {
    setEmailError(false);
    setPasswordError(false);

    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          console.log("Login success");
          setLoginSuccess(true);
          setTimeout(() => {
            navigation.navigate('Home');
          }, 1000); // Navegar después de la animación
        })
        .catch((err) => {
          console.log("Login error Firebase:", err.message);

          if (err.code === 'auth/invalid-email') {
            setEmailError(true);
          } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.message.includes('auth/invalid-login-credentials')) {
            setEmailError(true);
            setPasswordError(true);
          } else {
            console.log("Otro error de login:", err.message);
          }
        });
    } else {
      if (email === "") setEmailError(true);
      if (password === "") setPasswordError(true);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const shakeStyle = (shakeAnim) => ({
    transform: [{ translateX: shakeAnim }],
  });

  return (
    <View style={styles.container}>
      <Image source={backImage} style={styles.backImage} />
      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("welcome")}
        >
          <View style={styles.circle}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </View>
        </TouchableOpacity>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.loginContainer}>
              <Image source={loginLogo} style={styles.logo} />
              <Text style={styles.title}>Log In</Text>
              
              <Text style={styles.label}>Email or Username</Text>
              <Animated.View style={[
                styles.inputContainer,
                emailError && styles.errorBorder,
                shakeStyle(emailShake),
              ]}>
                <Ionicons name="mail-outline" size={24} color="#888" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter email or username"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoFocus={true}
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                />
              </Animated.View>
              {emailError && <Text style={styles.errorText}>Invalid email or username</Text>}

              <Text style={styles.label}>Password</Text>
              <Animated.View style={[
                styles.inputContainer,
                passwordError && styles.errorBorder,
                shakeStyle(passwordShake),
              ]}>
                <Ionicons name="lock-closed-outline" size={24} color="#888" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={!passwordVisible}
                  textContentType="password"
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Ionicons
                    name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                    size={24}
                    color="#888"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </Animated.View>
              {passwordError && <Text style={styles.errorText}>Invalid password</Text>}

              <View style={styles.buttonContainer}>
                <Animated.View style={[styles.button, { width: buttonWidth, height: buttonHeight, borderRadius }]}>
                  <TouchableOpacity onPress={onHandleLogin} disabled={loginSuccess} style={styles.buttonContent}>
                    {loginSuccess ? (
                      <Ionicons name="checkmark" size={30} color="rgba(41,86,81,0.84)" />
                    ) : (
                      <Text style={styles.buttonText}>Log In</Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </View>

              <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>or</Text>
                <View style={styles.separatorLine} />
              </View>

              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Image source={googleIcon} style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Image source={facebookIcon} style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Image source={appleIcon} style={styles.socialIcon} />
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                  <Text style={styles.signUpText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <StatusBar barStyle="light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(41,86,81,0.84)',
  },
  errorBorder: {
    borderColor: 'red',
    borderWidth: 1.5,
  },
  errorText: {
    color: 'red',
    bottom: 15,
    marginLeft: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: "#fff",
    alignSelf: "center",
    paddingBottom: 24,
  },
  logo: {
    width: 300,
    height: 200,
    left:'10%',
  },
  label: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  icon: {
    paddingHorizontal: 10,
  },
  backImage: {
    width: "100%",
    height: 340,
    position: "absolute",
    top: 0,
    resizeMode: 'cover',
    maskImage:"linear-gradient(balck:80%,transparent)",
  },
  whiteSheet: {
    width: '100%',
    height: '100%',
    position: "absolute",
    bottom: 0,
    backgroundColor: 'rgba(41,86,81,0.84)',
  },
    safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  loginContainer: {
    marginTop: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'rgba(41,86,81,0.84)',
    fontSize: 18,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 30,
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  footerText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 14,
  },
  signUpText: {
    color: '#ffd600',
    fontWeight: '600',
    fontSize: 14,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#fff',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#fff',
    fontWeight: '600',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  socialButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
});
