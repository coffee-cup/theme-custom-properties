type CustomProperties = Record<string, string>;

interface ThemeWithProperties<T> {
  customProperties: CustomProperties;
  transformedTheme: T;
}

interface Options {
  defaultTheme?: string;
  attribute?: string;
}

// Create CSS custom properties based on theme
export const generateCustomProperties = <T>(
  theme: T,
  prefix?: string,
): ThemeWithProperties<T> => {
  let customProperties: CustomProperties = {};
  const transformedTheme: any = {};

  for (const [name, value] of Object.entries(theme)) {
    if (typeof value === "object") {
      const {
        customProperties: nestedProperties,
        transformedTheme: nestedTheme,
      } = generateCustomProperties(
        value,
        `${prefix != null ? prefix + "-" + name : name}`,
      );
      transformedTheme[name] = nestedTheme;
      customProperties = { ...customProperties, ...nestedProperties };
    } else if (typeof value === "string") {
      const varName = `--${prefix != null ? prefix + "-" : ""}${name}`;
      transformedTheme[name] = `var(${varName})`;
      customProperties[varName] = value;
    }
  }

  return { customProperties, transformedTheme: transformedTheme };
};

const generateCustomPropertyCSS = <T>(
  mode: string | null,
  attribute: string,
  theme: ThemeWithProperties<T>,
): string => {
  const variables = Object.entries(theme.customProperties)
    .map(([varName, value]) => `${varName}: ${value};`)
    .join("\n");

  const attributeName =
    mode == null
      ? ":root"
      : attribute === "class"
      ? `.${mode}`
      : `[${attribute}="${mode}"]`;

  return `${attributeName} {
${variables}
}`;
};

/**
 * Transforms object of themes to custom properties (CSS variables) and returns
 * CSS string to add to page
 * @param themes object of color mode -> theme that will be transformed to custom properties
 * @param defaultColorTheme default color theme. These custom properties are added to the :root scope
 */
export const transformThemeToCustomProperties = <T>(
  themes: Record<string, T>,
  options?: Options,
): {
  transformedThemes: Record<string, T>;
  bodyCSS: string;
} => {
  const defaultColorTheme = options?.defaultTheme ?? "light";
  const attribute = options?.attribute ?? "data-theme";

  if (!(attribute === "class" || attribute.startsWith("data-"))) {
    throw new Error("options.attribute must be either 'class' or 'data-*'");
  }

  const themesWithProperties = Object.entries(themes).reduce(
    (acc, [colorMode, theme]) => ({
      ...acc,
      [colorMode]: generateCustomProperties<T>(theme),
    }),
    {} as Record<string, ThemeWithProperties<T>>,
  );

  const bodyCSS = [
    // default theme properties should get added to body
    generateCustomPropertyCSS(
      null,
      attribute,
      themesWithProperties[defaultColorTheme],
    ),

    ...Object.entries(themesWithProperties).map(([mode, theme]) =>
      generateCustomPropertyCSS(mode, attribute, theme),
    ),
  ].join("\n\n");

  const transformedThemes = Object.entries(themesWithProperties).reduce(
    (acc, [colorMode, themeWithProperties]) => ({
      ...acc,
      [colorMode]: themeWithProperties.transformedTheme,
    }),
    {} as Record<string, T>,
  );

  return { transformedThemes, bodyCSS };
};
