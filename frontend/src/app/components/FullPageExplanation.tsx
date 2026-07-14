import { ArrowRight } from 'lucide-react';

interface FullPageExplanationProps {
  onClose: () => void;
  data?: {
    title?: string;
    content?: string;
  } | null;
}

/**
 * Renders a simple markdown-like text:
 * - Lines starting with # / ## / ### become headings
 * - Lines starting with - or * become list items
 * - Lines wrapped in **bold** get bolded
 * - Lines wrapped in `code` get inline code style
 * - Empty lines become spacing
 */
function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      elements.push(<div key={idx} className="h-4" />);
      return;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={idx} className="mt-5 mb-2 font-serif text-lg font-semibold text-[#1A1A1A]">
          {trimmed.slice(4)}
        </h3>,
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={idx} className="mt-6 mb-3 font-serif text-xl font-semibold text-[#1A1A1A]">
          {trimmed.slice(3)}
        </h2>,
      );
      return;
    }
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={idx} className="mt-6 mb-3 font-serif text-2xl font-bold text-[#1A1A1A]">
          {trimmed.slice(2)}
        </h2>,
      );
      return;
    }

    // Code blocks (```...```)
    if (trimmed.startsWith('```')) {
      return; // skip code fence markers
    }

    // List items
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <li key={idx} className="ml-4 flex gap-3 leading-relaxed text-[#1A1A1A]">
          <span className="text-[#6366F1]">•</span>
          <span>{renderInline(trimmed.slice(2))}</span>
        </li>,
      );
      return;
    }

    // Numbered list items
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      elements.push(
        <li key={idx} className="ml-4 flex gap-3 leading-relaxed text-[#1A1A1A]">
          <span className="font-semibold text-[#6366F1]">{numberedMatch[1]}.</span>
          <span>{renderInline(numberedMatch[2])}</span>
        </li>,
      );
      return;
    }

    // Regular paragraph
    elements.push(
      <p key={idx} className="mb-2 leading-relaxed text-[#1A1A1A]">
        {renderInline(trimmed)}
      </p>,
    );
  });

  return elements;
}

function renderInline(text: string): (string | JSX.Element)[] {
  // Handle **bold** and `code`
  const parts: (string | JSX.Element)[] = [];
  const regex = /(\*\*(.*?)\*\*|`(.*?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2] !== undefined) {
      // Bold
      parts.push(
        <strong key={match.index} className="font-semibold">
          {match[2]}
        </strong>,
      );
    } else if (match[3] !== undefined) {
      // Inline code
      parts.push(
        <code key={match.index} className="rounded bg-[#F5F3EF] px-2 py-0.5 text-sm font-mono">
          {match[3]}
        </code>,
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

export function FullPageExplanation({ onClose, data }: FullPageExplanationProps) {
  const title = data?.title || 'Explanation';
  const content = data?.content || '';

  // Strip "Explanation: " prefix from card title for display
  const displayTitle = title.replace(/^Explanation:\s*/i, '') || 'Explanation';

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <div className="border-b border-black/10 px-6 py-4">
        <div className="mx-auto flex max-w-[720px] items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366F1] to-[#EC4899]">
            <span className="text-xs font-bold text-white">📖</span>
          </div>
          <h1 className="font-serif text-lg font-semibold text-[#1A1A1A]">{displayTitle}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-12">
        <div className="mx-auto w-full max-w-[720px]">
          {content ? (
            <div className="space-y-1">{renderMarkdown(content)}</div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg text-[#6B6B6B]">No explanation content available.</p>
              <p className="mt-2 text-sm text-[#999]">Ask Synapse AI a question to generate an explanation.</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-black/10 px-6 py-6">
        <div className="mx-auto flex max-w-[720px] items-center justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#EC4899] px-8 py-3 font-medium text-white shadow-lg transition-all hover:opacity-90"
          >
            Back to Chat
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
