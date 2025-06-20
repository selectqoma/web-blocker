# Brutal Site Blocker

A minimal Chrome extension that blocks distracting websites. The extension ships with a handful of predefined domains and lets you manage the block list through a simple popup interface.

## Installation

1. Clone or download this repository.
2. In Chrome, open `chrome://extensions` and enable **Developer mode**.
3. Choose **Load unpacked** and select the repository folder. The extension icon
   will appear in the toolbar.

## Default blocked sites

When first installed the extension blocks the following domains:

- `linkedin.com`
- `hotmail.com`
- `gmail.com`
- `instagram.com`

The domains are defined in `background.js` and stored in Chrome's local storage on installation.

## Usage

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

## Publishing to the Chrome Web Store

You can distribute this extension publicly through the Chrome Web Store. The basic
steps are:

1. Create a developer account at <https://chrome.google.com/webstore/developer> and pay the one-time registration fee.
2. In the Developer Dashboard, click **Add new item** and upload the contents of this repository as a zip file.
3. Fill out the required listing information (name, description, screenshots, etc.).
4. Submit the extension for review. Once approved it will be available in the store.

Refer to Google's official [Chrome Web Store documentation](https://developer.chrome.com/docs/webstore/publish/) for detailed instructions and policies.
