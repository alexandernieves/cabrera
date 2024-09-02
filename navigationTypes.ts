export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
    ConfirmCode: undefined;
    Home: undefined;
    Chat: undefined;
    NoInternet: undefined;
    Success: undefined;
    PreloaderCircle: { nextScreen: keyof RootStackParamList };
  };
  