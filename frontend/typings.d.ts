declare module '*.css';
declare module '*.less';
declare module '*.svg';
declare module '*.png';
declare module '*.json' {
  const content: object;
  export default content;
}

type Effect<StateType> = (
  // 该类型定义Effect类型
  action: import('redux').AnyAction,
  effects: import('dva').EffectsCommandMap & {
    select: <T>(func: (state: StateType) => T) => T;
  }
) => void;

type ModelType<StateType> = {
  // 定义模型类型接口
  namespace: string;
  state: StateType;
  effects: {
    [propName: string]: Effect<StateType>;
  };
  reducers: {
    [propName: string]: import('umi').ImmerReducer<StateType>;
  };
  subscriptions?: {setup: import('umi').Subscription};
};

type Nullable<T> = null | T;
