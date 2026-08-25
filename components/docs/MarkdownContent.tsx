function highlightCode(code: string, lang: string): string {
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  if (lang === "typescript" || lang === "tsx" || lang === "ts") {
    html = html
      .replace(
        /\b(import|export|from|const|let|type|interface|return|async|await)\b/g,
        '<span class="hljs-keyword">$1</span>'
      )
      .replace(
        /\b(renderFlower|createPrng|hashSeedToVariant|hashSeedToPalette)\b/g,
        '<span class="hljs-function">$1</span>'
      )
      .replace(/"([^"]*)"/g, '<span class="hljs-string">"$1"</span>')
      .replace(/'([^']*)'/g, "<span class=\"hljs-string\">'$1'</span>")
      .replace(/\b(\d+)\b/g, '<span class="hljs-number">$1</span>')
      .replace(/\/\/.*/g, (m) => `<span class="hljs-comment">${m}</span>`);
  }

  if (lang === "bash") {
    html = html
      .replace(/^(npm|npx|cd|git)\b/gm, '<span class="hljs-built_in">$1</span>')
      .replace(/(install|run|dev|build|test)/g, '<span class="hljs-keyword">$1</span>');
  }

  return html;
}

function renderInline(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, '<code class="rounded bg-paper-200 px-1 py-0.5 text-sm dark:bg-ink-800">$1</code>')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-sage-600 underline hover:text-sage-700 dark:text-sage-400">$1</a>'
    );
}

export function MarkdownContent({ content }: { content: string }) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || "text";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      elements.push(
        <pre
          key={key++}
          className="overflow-x-auto rounded-xl bg-ink-900 p-4 text-sm leading-relaxed text-paper-100"
        >
          <code
            dangerouslySetInnerHTML={{
              __html: highlightCode(codeLines.join("\n"), lang),
            }}
          />
        </pre>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={key++}
          className="mb-4 mt-8 font-display text-2xl font-semibold text-ink-900 first:mt-0 dark:text-paper-100"
        >
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith("| ")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const headers = tableLines[0]
        .split("|")
        .filter(Boolean)
        .map((c) => c.trim());
      const rows = tableLines.slice(2).map((row) =>
        row
          .split("|")
          .filter(Boolean)
          .map((c) => c.trim())
      );
      elements.push(
        <div key={key++} className="my-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-paper-300 dark:border-ink-700">
                {headers.map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-left font-medium text-ink-700 dark:text-paper-300"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr
                  key={ri}
                  className="border-b border-paper-200 dark:border-ink-800"
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="px-3 py-2 text-ink-600 dark:text-paper-400"
                      dangerouslySetInnerHTML={{ __html: renderInline(cell) }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++} className="my-4 list-disc space-y-1 pl-6 text-ink-600 dark:text-paper-400">
          {items.map((item) => (
            <li
              key={item}
              dangerouslySetInnerHTML={{ __html: renderInline(item) }}
            />
          ))}
        </ul>
      );
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    elements.push(
      <p
        key={key++}
        className="my-3 text-ink-600 leading-relaxed dark:text-paper-400"
        dangerouslySetInnerHTML={{ __html: renderInline(line) }}
      />
    );
    i++;
  }

  return <div className="prose-bloom">{elements}</div>;
}
