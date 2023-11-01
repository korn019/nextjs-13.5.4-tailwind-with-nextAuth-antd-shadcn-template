import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  hashed: false,

  components: {
    Button: {
      colorPrimary: "#3A58D6",
      colorBorder: "#3A58D6",
      colorText: "#3A58D6",
      colorPrimaryHover: "#3A58D6",
      borderRadius: 8,
    },
    Input: {
      colorBorder: "#3A58D6",
      colorText: "#3A58D6",
      colorPrimary: "#3A58D6",
      colorPrimaryHover: "#3A58D6",
      borderRadius: 8,
      fontFamily: "var(--font-noto)",
    },
  },
};

export default theme;
