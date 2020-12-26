<div style="text-align:center" align="center">
  <h1>LocalTunnel for VSCode</h1>
  <p><em>A VSCode extension for controlling <a href="https://theboroer.github.io/localtunnel-www/">LocalTunnel</a> from the command palette.</em></p>
  <p>
    <a href="https://github.com/mauriciosoares/localtunnel-for-vscode/actions"><img src="https://img.shields.io/github/workflow/status/mauriciosoares/localtunnel-for-vscode/CI.svg?logo=github&label=Tests" alt="GitHub Actions CI status" /></a>
  </p>
</div>

## Features

### `LocalTunnel: Start`

Start an HTTPS tunnel.

### Options

`Port`: Which port will be exposed (Default: 8000)

`Domain`: Custom domain for the tunnel (Default: random)

![start](https://user-images.githubusercontent.com/2321259/103156652-8efd7900-4789-11eb-9112-a03b4e3e0e3a.gif)

After you start the tunnel, you can either copy the generated link to your clipboard, or open a browser tab directly.

### `LocalTunnel: Stop`

Stops the current HTTP tunnel.

![stop](https://user-images.githubusercontent.com/2321259/103156657-958bf080-4789-11eb-8450-f9e8084eca1c.gif)

## Known Issues

* If you close the workspace you started the tunnel, the tunnel will automatically shut off.

* You can't start 2 tunnels at the same time

### 1.0.0

Initial release of LocalTunnel for VSCode.

## Contributors

### Author

**Mauricio Soares** - [GitHub](https://github.com/mauriciosoares)

### Thanks

I'd like to thank [Phil Nash](https://github.com/philnash), this extension was highly inspired by his cool [ngrok](https://github.com/philnash/ngrok-for-vscode) VS Code extension.