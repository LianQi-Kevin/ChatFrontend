import MarkdownIt from 'markdown-it';

// https://markdown-it.github.io/markdown-it/#MarkdownIt.new
const md: MarkdownIt = new MarkdownIt({
    html: true, linkify: true, typographer: true, highlight: function (str: string, lang: string): string {
        return `<pre id="codeSpace"><code class="language-${lang.toLowerCase()}">` + md.utils.escapeHtml(str) + `</code></pre>`;
    }
});

md.linkify.set({
    fuzzyLink: true, fuzzyIP: false, fuzzyEmail: true
});

export default md;