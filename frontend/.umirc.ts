import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
  mfsu: {},
  dva: {
    immer: { enableES5: true },
    hmr: true,
  },
  devServer: {
    https: true,
  },
});
