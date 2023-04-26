import type { Ace } from 'ace-builds';
export * from './base-editor';
export { ValidationAutoCompleter } from './ace/validation-autocompleter';
export { QueryAutoCompleter } from './ace/query-autocompleter';
export { StageAutoCompleter } from './ace/stage-autocompleter';
export { AggregationAutoCompleter } from './ace/aggregation-autocompleter';
export type AceEditor = Ace.Editor;
export type AceAnnotation = Ace.Annotation;
export type { CompletionWithServerInfo } from './types';
export { InlineEditor } from './inline-editor';
export { prettify } from './prettify';
export type { FormatOptions } from './prettify';
export { Editor } from './multiline-editor';
export {
  CodemirrorInlineEditor,
  CodemirrorMultilineEditor,
  setCodemirrorEditorValue,
} from './json-editor';
export type {
  EditorView,
  Command,
  Annotation,
  Action,
  EditorRef,
  Completer,
} from './json-editor';
export { SyntaxHighlight } from './syntax-highlight';
export { createDocumentAutocompleter } from './codemirror/document-autocompleter';
export { createValidationAutocompleter } from './codemirror/validation-autocompleter';
export { createQueryAutocompleter } from './codemirror/query-autocompleter';
export { createStageAutocompleter } from './codemirror/stage-autocompleter';
export { createAggregationAutocompleter } from './codemirror/aggregation-autocompleter';
