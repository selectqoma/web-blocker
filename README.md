# Brutal Site Blocker

A minimal Chrome extension that blocks distracting websites. The extension ships with a small list of predefined domains and lets you manage the block list via a popup.

## Loading the extension

1. Clone or download this repository.
2. In Chrome, open `chrome://extensions` and enable **Developer mode**.
3. Choose **Load unpacked** and select the repository folder. The extension icon will appear in the toolbar.

## Default blocked sites

When first installed the extension blocks the following domains:

- `linkedin.com`
- `hotmail.com`
- `gmail.com`
- `instagram.com`

The domains are defined in `background.js` and stored in Chrome's local storage on installation.

## Managing sites via the popup

Click the extension icon to open the popup. You can add a new domain by typing it in the input field and pressing **Block Site**. The domain is immediately blocked and saved for future browser sessions.

The popup also lists all currently blocked domains. Click **Unblock** next to a domain to remove it from the list and lift the block.

## File structure

```
background.js  - service worker that manages dynamic rules and storage
manifest.json   - extension manifest (v3)
popup.html      - popup interface
popup.js        - logic for adding/removing sites in the popup
```

## Contributing

Pull requests are welcome. Please keep contributions focused and include clear commit messages. If you add new features, consider updating the documentation as well.
