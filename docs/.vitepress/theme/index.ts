import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import PostList from "./components/PostList.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("PostList", PostList);
  },
} satisfies Theme;

