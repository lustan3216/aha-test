import {
  userLogin,
  userSignUp,
  userMe,
  userFacebookLogin,
  userGoogleLogin,
  userUpdate,
  userResetPassword,
  userLogout,
  userResendVerifyEmail,
} from '@/services/user';
import {AccountProvider} from '@/types/user';
import {removeToken} from '@/utils/auth';

export type UserStateType = {
  [key: string]: any;
  isVerify: boolean;
  email: Nullable<string>;
  provider: AccountProvider;
  username: Nullable<string>;
  picture: Nullable<string>;
};

export type UserModelType = ModelType<UserStateType>;

const initState = (): UserStateType => ({
  email: null,
  isVerify: false,
  provider: AccountProvider.Local,
  picture: null,
  username: null,
});

export default <UserModelType>{
  namespace: 'user',
  state: initState(),
  reducers: {
    setUser(state, {payload}) {
      state.email = payload.email;
      state.isVerify = payload.isVerify;
      state.provider = payload.provider;
      state.picture = payload.picture;
      state.username = payload.username;
    },
    cleanUser(state) {
      state.email = null;
      state.isVerify = false;
      state.provider = AccountProvider.Local;
      state.picture = null;
      state.username = null;
    },
  },
  effects: {
    *userUpdate({payload}, {call, put}) {
      const {data} = yield call(userUpdate, payload);
      yield put({type: 'setUser', payload: data});
    },
    *userMeGet(action, {call, put}) {
      const {data} = yield call(userMe);
      yield put({type: 'setUser', payload: data});
    },
    *signUp({payload}, {call}) {
      yield call(userSignUp, payload);
      yield call(userResendVerifyEmail);
    },
    *resetPassword({payload}, {call}) {
      yield call(userResetPassword, payload);
    },
    *login({payload}, {call, put}) {
      yield call(userLogin, payload);
      yield put({type: 'userMeGet'});
    },
    *loginFacebook({payload}, {call, put}) {
      yield call(userFacebookLogin, payload);
      yield put({type: 'userMeGet'});
    },
    *loginGoogle({payload}, {call, put}) {
      yield call(userGoogleLogin, payload);
      yield put({type: 'userMeGet'});
    },
    *logout(action, {call, put}) {
      yield call(userLogout);
      yield put({type: 'cleanUser'});
      removeToken();
    },
  },
  subscriptions: {
    setup({dispatch}) {
      dispatch({type: 'userMeGet'});
    },
  },
};
