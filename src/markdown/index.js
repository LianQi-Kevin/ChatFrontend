import MarkdownIt from 'markdown-it'
import Shiki from '@shikijs/markdown-it'

// todo: 待调整markdown主题

// default options passed to markdown-it
// see: https://markdown-it.github.io/markdown-it/
const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
})

md.use(await Shiki({
    // theme: https://github.com/shikijs/shiki/blob/v0/docs/themes.md#all-themes
    themes: {
        // light: 'vitesse-light',
        light: 'vitesse-dark',
        dark: 'vitesse-dark',
    }
}))

export default md