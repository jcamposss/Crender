# SketchUp extension

Ruby extension (`CRenderIA`) that hosts the plugin UI in a `UI::HtmlDialog`.

## Build the installable package

From the repository root:

```sh
make install   # first time only
make build
```

The package is written to `apps/sketchup-extension/dist/crender_ia-<version>.rbz`.
Every CI run also publishes it as the `sketchup-extension` artifact (Actions tab > run >
Artifacts), which is the easiest way to get it onto a Windows machine.

## Install in SketchUp (Windows and macOS)

1. Open SketchUp.
2. **Extensions > Extension Manager**.
3. Click **Install Extension** and pick the `.rbz` file. Confirm the warning about
   unsigned extensions (signing is a launch task).
4. Make sure **C.Render IA** is enabled in the list.
5. Open **Extensions > C.Render IA**. A window titled "C.Render IA" shows the
   installation message.

To update, uninstall the previous version in the Extension Manager, then install the new
`.rbz` and restart SketchUp.

## Troubleshooting

- Blank window or no menu item: open the Ruby Console (**Extensions > Developer > Ruby
  Console** in recent versions) and look for errors mentioning `crender_ia`.
- Menu item missing and no errors: check that the extension is enabled in the Extension
  Manager.
