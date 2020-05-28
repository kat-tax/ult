import {Style} from 'react-ult';
import CodeBlockWriter from 'code-block-writer';
import {formatTag, formatSlug} from './utils';
import * as style from './style';

export interface Component {
  deps: {},
  props: {},
  setup: {},
  render: {},
  styles: {},
}

export function getCode(component: ComponentNode) {
  const {code, dependencies, styles} = getContent([...component.children]);
  const root = {tag: 'View', slug: 'root', style: getStyle(component)};
  const deps = ['Styles', 'View', ...dependencies].join(', ');
  const name = formatTag(component.name);
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
  writer.write(`import {${deps}} from `);
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

function getContent(children, depth = 0, dependencies = [], styles = {}) {
  let code = [];
  children.reverse().forEach(child => {
    const isGroup = child.type === 'GROUP';
    const isText = child.type === 'TEXT';
    const slug = formatSlug(child.name);
    const tag = formatTag(child.type);
    styles[slug] = {tag, style: getStyle(child)};
    if (isText && dependencies.indexOf('Text') === -1)
      dependencies.push('Text');
    if (isText)
      code.push({slug, tag: 'Text', value: child.characters || ''});
    if (isGroup) {
      const content = getContent([...child.children], depth + 1, dependencies, styles);
      styles = {...styles, ...content.styles};
      code.push({slug, tag: 'View', children: content.code});
    }
  });
  return {code, dependencies, styles};
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

function convertNode(node: BaseNode) {
  if ('visible' in node && !node.visible)
    return '';
  switch (node.type) {
    case 'FRAME':
    case 'INSTANCE':
    case 'COMPONENT':
      return convertFrame(node);
    case 'GROUP':
      return convertGroup(node);
    case 'BOOLEAN_OPERATION':
    case 'VECTOR':
    case 'STAR':
    case 'LINE':
    case 'ELLIPSE':
    case 'POLYGON':
      return convertShape(node);
    case 'RECTANGLE':
      return convertRectangle(node);
    case 'TEXT':
      return convertText(node);
    case 'PAGE':
    case 'SLICE':
    case 'DOCUMENT':
    default:
      return '';
  }
}

function convertChildren(children: ReadonlyArray<BaseNode>) {
  const nodes: BaseNode[] = []
  const walk = (children: ReadonlyArray<BaseNode>) => {
    for (const child of children) {
      if (child.type !== "GROUP") {
        nodes.push(child);
      } else if (child.visible) {
        if (child.parent
          && 'layoutMode' in child.parent
          && child.parent.layoutMode !== "NONE") {
          nodes.push(child);
        } else {
          walk(child.children);
        }
      }
    }
  };

  walk(children);
  return nodes.map(convertNode).join('\n');
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
