declare module 'tweakpane' {
  export interface TpChangeEvent<T> {
    readonly value: T;
  }

  export interface BindingApi {
    on(event: 'change', handler: (ev: TpChangeEvent<unknown>) => void): this;
  }

  export interface ButtonApi {
    on(event: 'click', handler: () => void): this;
  }

  export interface FolderApi {
    addBinding(obj: Record<string, unknown>, key: string, params?: Record<string, unknown>): BindingApi;
    addFolder(params: { title: string }): FolderApi;
    addTab(params: { pages: readonly { title: string }[] }): TabApi;
    addButton(params: { title: string }): ButtonApi;
    refresh(): void;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface TabPageApi extends FolderApi {}

  export interface TabApi {
    readonly pages: TabPageApi[];
  }

  export class Pane implements FolderApi {
    constructor(config?: { title?: string });
    get element(): HTMLElement;
    dispose(): void;
    addBinding(obj: Record<string, unknown>, key: string, params?: Record<string, unknown>): BindingApi;
    addFolder(params: { title: string }): FolderApi;
    addTab(params: { pages: readonly { title: string }[] }): TabApi;
    addButton(params: { title: string }): ButtonApi;
    refresh(): void;
  }
}
