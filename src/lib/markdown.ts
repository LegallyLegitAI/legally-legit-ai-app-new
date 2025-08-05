export interface MarkdownMeta {
  title: string;
  description: string;
  slug: string;
  tags?: string[];
  author?: string;
  datePublished?: string;
  seoKeywords?: string;
}

export interface MarkdownContent {
  meta: MarkdownMeta;
  content: string;
}

export function parseMarkdown(rawContent: string, slug: string): MarkdownContent {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = rawContent.match(frontMatterRegex);
  
  if (!match) {
    return {
      meta: {
        title: 'Untitled',
        description: '',
        slug,
      },
      content: rawContent,
    };
  }

  const frontMatter = match[1];
  const content = match[2];
  
  // Parse YAML-like front matter
  const meta: Partial<MarkdownMeta> = { slug };
  const lines = frontMatter.split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
    
    if (key && value) {
      (meta as any)[key] = value;
    }
  }

  return {
    meta: meta as MarkdownMeta,
    content,
  };
}
