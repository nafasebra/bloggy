'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { cn } from './utils';

export interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

const proseClasses =
  'prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-code:text-pink-600 dark:prose-code:text-pink-400 break-words';

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  return (
    <div className={cn(proseClasses, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
      >
        {content || '*No content to preview*'}
      </ReactMarkdown>
    </div>
  );
}
