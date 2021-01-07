# theme-custom-properties

![CI](https://github.com/coffee-cup/theme-custom-properties/workflows/CI/badge.svg)
[![](https://img.shields.io/npm/v/theme-custom-properties?style=flat-square)](https://www.npmjs.com/package/theme-custom-properties)
[![](https://img.shields.io/github/license/coffee-cup/theme-custom-properties?style=flat-square&color=brightgreen)](https://github.com/coffee-cup/theme-custom-properties/blob/main/LICENSE)

Convert a theme object to CSS custom properties (variables) and CSS that you can add to your website.

```ts
import { transformThemeToCustomProperties } from "theme-custom-properties";

const { bodyCSS, transformedTheme } = transformThemeToCustomProperties({
  light: {
    colors: {
      foreground: "black",
      background: "white"
    }
  },
  dark: {
    colors: {
      foreground: "white",
      background: "black"
    }
  }
});

console.log(bodyCSS);
/*

:root {
  --colors-foreground: "black";
  --colors-background: "white";
}

[data-theme="light"] {
  --colors-foreground: "black";
  --colors-background: "white";
}

[data-theme="dark"] {
  --colors-foreground: "black";
  --colors-background: "white";
}
*/

console.log(transformedTheme)
/*
{
  light: {
    colors: {
      foreground: "var(--colors-foreground)",
      background: "var(--colors-background)"
    }
  },
  dark: {
    colors: {
      foreground: "var(--colors-foreground)",
      background: "var(--colors-background)"
    }
  }
}
*/
```

## Install

```
yarn add theme-custom-properties
# or
npm i --save theme-custom-properties
```

## Usage

Convert your themes

```ts
import { transformThemeToCustomProperties } from "theme-custom-properties";

const { bodyCSS, transformedThemes } = transformThemeToCustomProperties({
  light: { /* ... */ },
  dark: { /* ... */ }
});
```

Add the `bodyCSS` to the document and pass the transformed theme to your `ThemeProvider` (e.g. [styled-components](https://styled-components.com/docs/advanced#the-theme-prop). Get the currently selected theme from something like [next-themes](https://github.com/pacocoursey/next-themes).

For example, with [NextJS](https://nextjs.org/).

```tsx
const MyApp = ({ Component, pageProps }: AppProps) => {
  const currentTheme = "dark"
  return (
    <ThemeProvider theme={transformedThemes[currentTheme]}>
      <Head>
        <style>{bodyCSS}</style>
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
)
```

Now you can use your theme and it will use CSS variables instead.

## API

### transformThemeToCustomProperties(themes, options?) => { bodyCSS, transformedThemes }

- `themes`: Themes for all colors modes.
e.g.
```ts
const themes = {
  light: { /* ... */ },
  dark: { /* ... */ },
}
```

- `options`
  * `defaultTheme = "light"`: The default color mode. `themes[defaultTheme]` will be added to `:root` in `bodyCSS`
  * `attribute = "data-theme"`: HTML attribute modified based on the active theme. Accepts class and data-*
  
Returns

- `bodyCSS`: string containing CSS custom properties that you can add to the HTML document
- `transformedThemes`: object in same shape as `themes`. Values are replaced with CSS variable string

## Development

This library was bootstrapped with [tsdx](https://github.com/formium/tsdx).

Build

```
yarn build
```

Test

```
yarn test
```
