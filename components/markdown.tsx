import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders trusted markdown (authored in the admin dashboard) into styled HTML.
 * Styling is handled by the `.article-body` scope in globals.css.
 */
export function MarkdownBody({ children }: { children: string }) {
  return (
    <div className="article-body">
      <Markdown remarkPlugins={[remarkGfm]}>{children}</Markdown>
    </div>
  );
}
