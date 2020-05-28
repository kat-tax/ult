export function formatTag(value: string) {
  return value.replace(/\s/g, '');
}

export function formatSlug(value: string) {
  return value.split(' ').map((word, index) => {
    if (index == 0) return word.toLowerCase();
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join('');
}

export function getColor(rgb: RGB, opacity: number = 1) {
  const r = 255.0 * rgb.r; 
  const g = 255.0 * rgb.g; 
  const b = 255.0 * rgb.b;
  if (opacity < 1) {
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } else {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
}

export function getColorFromPaint(fills: ReadonlyArray<Paint>): string | null {
  const paint = fills.find(f => f.type === 'SOLID' && f.visible) as SolidPaint;
  if (paint == null) return null;
  return getColor(paint.color, paint.opacity || 1.0);
}

export function getTextWeight(style: string) {
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

export function getBoundingBox(node: LayoutMixin) {
  const {width, height, absoluteTransform} = node;
  const m00 = absoluteTransform[0][0];
  const m01 = absoluteTransform[0][1];
  const m02 = absoluteTransform[0][2];
  const m10 = absoluteTransform[1][0];
  const m11 = absoluteTransform[1][1];
  const m12 = absoluteTransform[1][2];
  const p1 = [m02, m12];
  const p2 = [m01 * height + m02, m11 * height + m12];
  const p3 = [m00 * width + m02, m10 * width + m12];
  const p4 = [m00 * width + m01 * height + m02, m10 * width + m11 * height + m12];
  const x = Math.min(p1[0], p2[0], p3[0], p4[0]);
  const y = Math.min(p1[1], p2[1], p3[1], p4[1]);
  const xMax = Math.max(p1[0], p2[0], p3[0], p4[0]);
  const yMax = Math.max(p1[1], p2[1], p3[1], p4[1]);
  return {x, y, width: xMax - x, height: yMax - y};
}

export function getComponentType(type: NodeType) {
  switch (type) {
    case 'COMPONENT':
    case 'INSTANCE':
    case 'RECTANGLE':
    case 'GROUP':
      return 'View';
    case 'TEXT':
      return 'Text';
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
