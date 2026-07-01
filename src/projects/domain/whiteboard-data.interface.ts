export class ExcalidrawFile {
  id!: string;
  dataURL!: string;
  mimeType!: string;
  created!: number;
  lastRetrieved?: number;
  [key: string]: unknown;
}

export class ExcalidrawWhiteboardData {
  elements?: unknown[];
  appState?: Record<string, unknown>;
  files?: Record<string, ExcalidrawFile>;
  [key: string]: unknown;
}
