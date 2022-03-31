import {
  userLogin,
  userSignUp,
  userMe,
  userFacebookLogin,
  userGoogleLogin,
  userUpdate,
  userResetPassword,
} from '@/services/user';
import Cookie from 'js-cookie';
import {AccountProvider} from '@/types/user';

export type UserStateType = {
  [key: string]: any;
  isVerify: boolean;
  tryFetched: boolean;
  email: Nullable<string>;
  provider: AccountProvider;
  username: Nullable<string>;
  picture: Nullable<string>;
};

export type UserModelType = ModelType<UserStateType>;

const initState = (): UserStateType => ({
  tryFetched: false,
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
    tryFetch(state) {
      state.tryFetched = true;
    },
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
      try {
        const {data} = yield call(userUpdate, payload);
        yield put({type: 'setUser', payload: data});
      } finally {
        yield put({type: 'tryFetch'});
      }
    },
    *userMeGe(action, {call, put}) {
      try {
        const token = Cookie.get('Authorization');
        if (token) {
          const {data} = yield call(userMe);
          yield put({type: 'setUser', payload: data});
        }
      } finally {
        yield put({type: 'tryFetch'});
      }
    },
    *signUp({payload}, {call, put}) {
      try {
        yield call(userSignUp, payload);
        yield put({type: 'userMeGe'});
      } catch (e) {
        yield put({type: 'logout'});
      }
    },
    *resetPassword({payload}, {call}) {
      yield call(userResetPassword, payload);
    },
    *login({payload}, {call, put}) {
      try {
        yield call(userLogin, payload);
        yield put({type: 'userMeGe'});
      } catch (e) {
        yield put({type: 'logout'});
      } finally {
        yield put({type: 'tryFetch'});
      }
    },
    *loginFacebook({payload}, {call, put}) {
      yield call(userFacebookLogin, payload);
      yield put({type: 'userMeGe'});
    },
    *loginGoogle({payload}, {call, put}) {
      yield call(userGoogleLogin, payload);
      yield put({type: 'userMeGe'});
    },
    *logout(action, {put}) {
      Cookie.remove('Authorization');
      yield put({type: 'cleanUser'});
    },
  },
  subscriptions: {
    setup({dispatch}) {
      dispatch({type: 'userMeGe'});
    },
  },
};

// (async function() {
//   try {
//
//
//     if (userId && !isVerify) {
//       history.push('/auth/email-verify')
//     }
//   } catch (e) {
//     history.push('/auth/login')
//   }
// })()
