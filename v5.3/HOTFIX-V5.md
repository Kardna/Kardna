# Kardna Proxy V5.1 hotfix

This build fixes the crash shown by:

```text
TypeError: connection.streams is not iterable
```

The crash came from enabling `wisp.options.stream_limit_per_host` in Wisp 0.4.1. Its current filter treats the streams object like an iterable. Once Node exits, the iframe can also display curl code 35 because its Wisp connection disappeared.

## Windows replacement steps

1. Close the old Kardna terminal.
2. Back up `public/games` if it contains games you added.
3. Extract this V5.1 folder.
4. Copy your backed-up game folders into `public/games`.
5. Open PowerShell in the V5.1 folder and run:

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
npm run proxy:verify
npm run dev
```

6. Open `http://localhost:8080`.
7. In Kardna, open **Proxy**, click **Clear Proxy Data** once, and reload the page.
8. Leave **Ultraviolet** as the engine and **Epoxy TLS** as the transport for the first test.

Libcurl.js is still available in Settings, but Epoxy TLS is the safer default for this Windows setup.
