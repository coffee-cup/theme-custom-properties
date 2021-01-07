import {
  generateCustomProperties,
  transformThemeToCustomProperties,
} from "../src";

const darkTheme = {
  hello: "world",
  colors: {
    primary: "white",
    background: "black",
    grey: {
      100: "#fff",
      500: "black",
    },
  },
  shadows: {
    box: "2px 2px 2px black",
  },
};

const lightTheme = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    primary: "black",
    background: "white",
  },
};

describe("custom properties", () => {
  it("generates custom properties for top level values", () => {
    const theme = { hello: "world", foo: 1 };
    expect(generateCustomProperties(theme)).toEqual({
      customProperties: {
        "--hello": "world",
      },
      transformedTheme: {
        hello: "var(--hello)",
      },
    });
  });

  it("generates custom properties for nested theme", () => {
    expect(generateCustomProperties(darkTheme)).toEqual({
      customProperties: {
        "--hello": "world",
        "--colors-primary": "white",
        "--colors-background": "black",
        "--colors-grey-100": "#fff",
        "--colors-grey-500": "black",
        "--shadows-box": "2px 2px 2px black",
      },
      transformedTheme: {
        hello: "var(--hello)",
        colors: {
          background: "var(--colors-background)",
          grey: {
            "100": "var(--colors-grey-100)",
            "500": "var(--colors-grey-500)",
          },
          primary: "var(--colors-primary)",
        },
        shadows: {
          box: "var(--shadows-box)",
        },
      },
    });
  });
});

describe("body css", () => {
  it("generates CSS with default options", () => {
    expect(
      transformThemeToCustomProperties({
        dark: darkTheme,
        light: lightTheme,
      }),
    ).toMatchSnapshot();
  });

  it("generates CSS with dark default theme", () => {
    expect(
      transformThemeToCustomProperties(
        {
          dark: darkTheme,
          light: lightTheme,
        },
        {
          defaultTheme: "dark",
        },
      ),
    ).toMatchSnapshot();
  });

  it("generates CSS with class attribute", () => {
    expect(
      transformThemeToCustomProperties(
        {
          dark: darkTheme,
          light: lightTheme,
        },
        {
          attribute: "class",
        },
      ),
    ).toMatchSnapshot();
  });
});
