import CodeBlockWriter from 'code-block-writer';

interface Component {
  deps: {},
  props: {},
  setup: {},
  render: {},
  styles: {},
}

export function getCode(component: ComponentNode) {
  const {code, deps, styles} = getContent([...component.children]);
  const root = {tag: 'View', slug: 'root', style: getStyle(component)};
  const name = convertComponentName(component.name);
  const dependencies = ['Styles', 'View', ...deps].join(', ');
  const writer = new CodeBlockWriter({
    newLine: "\r\n",         // default: "\n"
    useTabs: false,          // default: false
    useSingleQuote: false,   // default: false
    indentNumberOfSpaces: 2, // default: 4
  });

  const writeContents = (lines) => {
    lines.forEach((line) => {
      writer.write(`<${line.tag} style={styles.${line.slug}}>`).indent(() => {
        if (line.tag === 'Text') {
          writer.write('{');
          writer.quote(line.value);
          writer.write('}');
        } else if (line.tag === 'View') {
          writeContents(line.children);
        }
      });
      writer.writeLine(`</${line.tag}>`);
    });
  };

  writer.write('import React from ');
  writer.quote('react');
  writer.write(';');
  writer.newLine();
  writer.write(`import {${dependencies}} from `);
  writer.quote('react-ult');
  writer.write(';');
  writer.newLine();
  writer.blankLine();
  writer.write(`export function ${name}()`).block(() => {
    writer.write(`return (`).indent(() => {
      writer.write(`<View style={styles.root}>`).indent(() => {
        writeContents(code);
      });
      writer.writeLine('</View>');
    });
    writer.writeLine(');');
  });
  writer.blankLine();
  writer.write(`const styles = `).block(() => {
    const properties = Object
      .keys(root.style)
      .filter(c => root.style[c] !== undefined);
    if (properties.length > 0) {
      writer.write(`${root.slug}: Styles.create${root.tag}Style({`).indent(() => {
        properties.forEach(property => {
          const value = root.style[property];
          writer.write(`${property}: `);
          if (typeof value === 'number') {
            writer.write(value.toString());
          } else {
            writer.quote(value);
          }
          writer.write(',');
          writer.newLine();
        });
      });
      writer.writeLine('}),');
    }
    Object.keys(styles).forEach(slug => {
      const child = styles[slug];
      if (child && child.tag !== 'Unknown') {
        const properties = Object
          .keys(child.style)
          .filter(c => child.style[c] !== undefined);
        if (properties.length > 0) {
          writer.write(`${slug}: Styles.create${child.tag}Style({`).indent(() => {
            properties.forEach(property => {
              const value = child.style[property];
              writer.write(`${property}: `);
              if (typeof value === 'number') {
                writer.write(value.toString());
              } else {
                writer.quote(value);
              }
              writer.write(',');
              writer.newLine();
            });
          });
          writer.writeLine('}),');
        }
      }
    });
  });

  return writer.toString();
}

function getContent(children, depth = 0, deps = [], styles = {}) {
  let code = [];

  children.reverse().forEach(child => {
    const isGroup = child.type === 'GROUP';
    const isText = child.type === 'TEXT';
    const tag = convertElementTag(child.type);
    const slug = convertVariableName(child.name);

    styles[slug] = {tag, style: getStyle(child)};
  
    if (isText && deps.indexOf('Text') === -1) {
      deps.push('Text');
    }

    if (isText) {
      code.push({slug, tag: 'Text', value: child.characters || ''});
    }

    if (isGroup) {
      const content = getContent([...child.children], depth + 1, deps, styles);
      styles = {...styles, ...content.styles};
      code.push({slug, tag: 'View', children: content.code});
    }
  });

  return {code, deps, styles};
}

function getStyle(component) {
  const isText = component.type === 'TEXT';
  const isGroup = component.type === 'GROUP';
  const isComponent = component.type === 'COMPONENT';

  let styles = {};

  if (isComponent || isGroup) {
    let backgroundColor: string;
    if (component.backgrounds.length > 0) {
      const {r, g, b} = component.backgrounds[0].color;
      backgroundColor = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
    }
    styles = {
      ...styles,
      backgroundColor,
    };
    /*
      const flexbox = {
        backgroundColor: color = undefined; // Value is animatable
        opacity: number = 1.0; // Value is animatable
        overflow: 'hidden' | 'visible';

        borderWidth: number;
        borderTopWidth: number;
        borderRightWidth: number;
        borderBottomWidth: number;
        borderLeftWidth: number;
        borderColor: color;
        borderStyle: 'solid' | 'dotted' | 'dashed' | 'none';
        borderRadius: number;  // Sets all four border radius attributes; value is animatable
        borderTopRightRadius: number = 0;
        borderBottomRightRadius: number = 0;
        borderBottomLeftRadius: number = 0;
        borderTopLeftRadius: number = 0;

        // NOTE: If applied to a Text element, these properties translate to text shadows,
        // not a box shadow.
        shadowOffset: { height: number; width: number } = { 0, 0 };
        shadowRadius: number = 0;
        shadowColor: color = 'black';
        elevation: number; // Android only

        wordBreak: 'break-all' | 'break-word'; // Web only
        appRegion: 'drag' | 'no-drag'; // Web only
        cursor: 'pointer' | 'default'; // Web only
      }
    */
  }

  if (isText) {
    let color: string;
    if (component.fills.length > 0) {
      const {r, g, b} = component.fills[0].color;
      color = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
    }
    const fontSize = component.fontSize;
    const fontFamily = component.fontName.family;
    const isItalic = component.fontName.style.indexOf('Italic') !== -1;
    const isBold = component.fontName.style.indexOf('Bold') !== -1;
    const isThin = component.fontName.style.indexOf('Thin') !== -1;
    const isUnderline = component.textDecoration === 'UNDERLINE';
    const isCrossed = component.textDecoration === 'STRIKETHROUGH';
    const isAlignLeft = component.textAlignHorizontal === 'LEFT';
    const isAlignRight = component.textAlignHorizontal === 'RIGHT';
    const isAlignTop = component.textAlignVertical === 'TOP';
    const isAlignBottom = component.textAlignVertical === 'BOTTOM';
  
    styles = {
      ...styles,
      color,
      fontSize,
      fontFamily,
      letterSpacing: undefined, // TODO
      lineHeight: undefined, // TODO
      fontStyle: isItalic ? 'italic' : undefined,
      fontWeight: isBold ? '700' : isThin ? '300' : undefined,
      textAlign: isAlignLeft ? 'left' : isAlignRight ? 'right' : undefined,
      textAlignVertical: isAlignTop ? 'top' : isAlignBottom ? 'bottom' : undefined,
      textDecorationLine: isUnderline ? 'underline' : isCrossed ? 'line-through' : undefined,
    };
  }

  return styles;
}

// Conversions
function convertComponent() {
  // Turn a component and it's children into code
}

function convertLayout() {
  // Convert figma auto layout to flexbox
}

function convertFrame() {
  // Convert frames and groups to Views
}

function convertText() {
  // Convert text properties
}

function convertShape() {
  // Convert shapes & images to ULT components
}

function convertVector() {
  // Convert SVGs to ULT components
}

function convertRectangle() {
  // Convert rectangle shapes to Views w/ backgrounds
}

function convertColor() {
  // Convert colors from paint fill
}

function convertEvents() {
  // Convert event handlers
}

function convertElementTag(type: string) {
  switch (type) {
    case 'COMPONENT':
    case 'INSTANCE':
    case 'RECTANGLE':
    case 'GROUP':
      return 'View';
    case 'TEXT':
      return 'Text';
    case 'IMAGE':
      return 'Image';
    case 'BOOLEAN_OPERATION':
    case 'VECTOR':
    case 'STAR':
    case 'LINE':
    case 'ELLIPSE':
    case 'POLYGON':
      return 'Svg';
    default:
      return 'Unknown';
  }
}

function convertComponentName(value: string) {
  return value.replace(/\s/g, '');
}

function convertVariableName(value: string) {
  return value.split(' ').map((word, index) => {
    if (index == 0) return word.toLowerCase();
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join('');
}

// Helpers

function getColor(rgb: RGB, opacity: number) {
  const {r,g,b} = rgb;
  return `rgba(${255.0 * r}, ${255.0 * g}, ${255.0 * b}, ${opacity})`;
}

function getColorFromPaint(fills: ReadonlyArray<Paint>): string | null {
  const paint = fills.find(f => f.type === 'SOLID' && f.visible) as SolidPaint;
  if (paint == null) return null;
  return getColor(paint.color, paint.opacity || 1.0);
}

function getOpacity(node: BlendMixin) {
  if (node.opacity === 1) return {};
  return node.opacity;
}

function getEffects(node: BaseNode & BlendMixin) {
  const style = {}
  for (const effect of node.effects) {
    if (!effect.visible) continue;
    if (effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW') {
      const prop = `${node.type === 'TEXT' ? 'text' : 'box'}-shadow`;
      style[prop] = `${effect.type === "INNER_SHADOW" ? 'inset ' : ''}${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${getColor(effect.color, effect.color.a)}`;
    } else if (effect.type === "BACKGROUND_BLUR") {
      style["backdrop-filter"] = `blur(${effect.radius}px)`;
    }
  }
  return style;
}

function getCornerStyle(node: any/*RectangleCornerMixin*/) {
  return {"border-radius": `${node.topLeftRadius}px ${node.topRightRadius}px ${node.bottomRightRadius}px ${node.bottomLeftRadius}px`};
}

function getTextWeight(style: string): number {
  switch (style.replace(/\s*italic\s*/i, '')) {
    case 'Thin':
      return 100;
    case 'Extra Light':
    case 'Extra-light':
      return 200;
    case 'Light':
      return 300;
    case 'Regular':
      return 400;
    case 'Medium':
      return 500;
    case 'Semi Bold':
    case 'Semi-bold':
      return 600;
    case 'Bold':
      return 700;
    case 'Extra Bold':
    case 'Extra-bold':
      return 800;
    case 'Black':
      return 900;
  }
  return 400;
}
