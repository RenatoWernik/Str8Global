// Type declarations for splitting library
// splitting doesn't ship with TypeScript types

declare module 'splitting' {
  interface SplittingOptions {
    target?: HTMLElement | string;
    by?: 'chars' | 'words' | 'lines';
    key?: string;
  }

  interface SplittingResult {
    el: HTMLElement;
    words?: HTMLElement[];
    chars?: HTMLElement[];
    lines?: HTMLElement[];
  }

  function Splitting(options?: SplittingOptions): SplittingResult[];

  export default Splitting;
}

declare module 'splitting/dist/splitting-cells.css' {
  const content: any;
  export default content;
}
