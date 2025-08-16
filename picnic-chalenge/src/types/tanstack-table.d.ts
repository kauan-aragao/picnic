declare module "@tanstack/react-table" {
  import * as React from "react";
  export type ColumnDef<T, TValue> = any;
  export function useReactTable(opts: any): any;
  export function getCoreRowModel(): any;
  export function flexRender(comp: any, ctx: any): React.ReactNode;
}
