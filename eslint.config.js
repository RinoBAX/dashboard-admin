import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";

export default [
  // Konfigurasi global untuk mengabaikan file/folder tertentu
  {
    ignores: ["dist", "node_modules"],
  },
  
  // Aturan dasar dari ESLint
  pluginJs.configs.recommended,
  
  // Aturan yang direkomendasikan untuk React
  ...fixupConfigRules(pluginReactConfig),
  
  // Aturan untuk aksesibilitas pada elemen JSX
  {
    plugins: { "jsx-a11y": pluginJsxA11y },
    rules: {
      ...pluginJsxA11y.configs.recommended.rules,
    },
  },

  // Aturan untuk React Hooks
  {
    plugins: { "react-hooks": pluginReactHooks },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
    },
  },

  // Konfigurasi utama untuk file .js dan .jsx
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser, 
        ...globals.node,   
      },
    },
    settings: {
      react: {
        version: "detect", 
      },
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off", 
      "no-unused-vars": "warn", 
    },
    plugins: {
      "react-refresh": pluginReactRefresh,
    }
  },
];