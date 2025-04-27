/**
 * Глобальные типы для приложения
 */

// Декларация для возможных импортов SVG
declare module '*.svg' {
    const content: string;
    export default content;
  }
  
  // Декларация для возможных импортов CSS
  declare module '*.css' {
    const content: string;
    export default content;
  }
  
  // Декларация для возможных импортов изображений
  declare module '*.png' {
    const content: string;
    export default content;
  }
  
  declare module '*.jpg' {
    const content: string;
    export default content;
  }
  
  declare module '*.gif' {
    const content: string;
    export default content;
  }