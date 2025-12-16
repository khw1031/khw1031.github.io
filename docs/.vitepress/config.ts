import { defineConfig } from "vitepress";

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
  title: "김현우",
  description: "김현우의 블로그",
  themeConfig: {
    siteTitle: false,
    nav: [
      { text: "HOME", link: "/" },
      { text: "READ & WRITE", link: "/read-and-write/" },
      { text: "CV", link: "/cv" },
    ],

    sidebar: {},
    socialLinks: [{ icon: "github", link: "https://github.com/khw1031" }],
  },
});
