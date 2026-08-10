// Crimson Deck theme styles.
// The base layout CSS from @slidev/client is intentionally NOT imported so the
// theme fully owns every layout's look (padding, typography, backgrounds).
import { installAccentPalette } from '../composables/accent'
import './vars.css'
import './layout.css'
import './code.css'

// Derive --cd-accent-{deep,dim,light,bright,soft}, --cd-accent-rgb and
// --cd-on-accent from the deck's accent color. vars.css ships the crimson
// defaults, so this only matters once a deck sets its own primary.
installAccentPalette()
