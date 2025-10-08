# Markdown Editor Integration

This project now includes a rich markdown editor for creating and editing blog posts.

## Features

- **Rich Text Toolbar**: Easy-to-use toolbar with formatting buttons for:
  - Bold, Italic, Headings
  - Lists (ordered & unordered)
  - Quotes, Code blocks, Tables
  - Links and Images
  - Live preview and side-by-side editing modes
  - Fullscreen mode for distraction-free writing

- **Markdown Support**: Write using standard markdown syntax
- **Live Preview**: Real-time preview of your markdown content
- **Dark Mode**: Full dark mode support
- **Auto-save status**: Character and word count display

## Usage

### Creating a New Post

1. Navigate to `/blog/new` or `/dashboard/posts/create`
2. Fill in the post details (title, excerpt, category, tags)
3. Use the rich markdown editor to write your content
4. Click on the toolbar buttons to format your text, or use markdown syntax directly
5. Switch to the **Preview** tab to see how your post will look
6. Click **Create Post** to publish

### Markdown Formatting Guide

#### Headers
```markdown
# H1 Header
## H2 Header
### H3 Header
```

#### Text Formatting
```markdown
**Bold text**
*Italic text*
~~Strikethrough~~
```

#### Lists
```markdown
- Unordered item 1
- Unordered item 2

1. Ordered item 1
2. Ordered item 2
```

#### Links and Images
```markdown
[Link text](https://example.com)
![Alt text](image-url.jpg)
```

#### Code
```markdown
Inline `code` with backticks

```
Code block with triple backticks
```
```

#### Quotes
```markdown
> This is a blockquote
```

#### Tables
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

## Components

### MarkdownEditor
A rich markdown editor component with toolbar and preview functionality.

**Props:**
- `value`: Current markdown content (string)
- `onChange`: Callback function when content changes
- `placeholder`: Placeholder text (optional)

**Example:**
```tsx
<MarkdownEditor
  value={content}
  onChange={(newValue) => setContent(newValue)}
  placeholder="Write your content here..."
/>
```

### MarkdownPreview
A component to render markdown content with proper styling.

**Props:**
- `content`: Markdown content to render (string)

**Example:**
```tsx
<MarkdownPreview content={markdownContent} />
```

## Libraries Used

- **react-simplemde-editor**: Markdown editor with toolbar
- **easymde**: Core markdown editor engine
- **react-markdown**: Markdown to React component renderer
- **remark-gfm**: GitHub Flavored Markdown support
- **rehype-raw**: HTML support in markdown
- **rehype-sanitize**: Sanitize HTML for security

## Customization

The markdown editor styles can be customized in `/src/styles/markdown-editor.css`. The file includes styles for:
- Editor container and toolbar
- Dark mode support
- Syntax highlighting
- Preview mode styling
