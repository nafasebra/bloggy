import { useMemo } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import type { Options } from 'easymde';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
}: MarkdownEditorProps) {
  const options = useMemo<Options>(
    () => ({
      placeholder,
      spellChecker: false,
      autofocus: false,
      status: ['lines', 'words', 'cursor'],
      toolbar: ['bold', 'italic', 'strikethrough', '|', 'heading-1', 'heading-2', 'heading-3', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'link', 'image', '|', 'code', 'table', 'horizontal-rule', '|', 'preview', 'side-by-side', 'fullscreen', '|', 'guide'],
      minHeight: '400px',
      maxHeight: '600px',
      sideBySideFullscreen: false,
    }),
    [placeholder]
  );

  return (
    <div className="markdown-editor-wrapper">
      <SimpleMDE value={value} onChange={onChange} options={options} />
    </div>
  );
}
