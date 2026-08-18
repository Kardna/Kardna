# Legacy game catalog import

The file supplied for this revision used this shape:

```json
{
  "games": [
    {
      "title": "Game name",
      "image": "https://example.invalid/cover.png",
      "iframe": "https://example.invalid/game"
    }
  ]
}
```

Kardna's loader now accepts that structure directly. The bundled `public/games.json` has also been converted to the richer current schema so search, filters, player counts, session length, mature filtering, and discovery work consistently.

Placeholder entries pointing to `https://example.com` were intentionally excluded because they are not games. Existing local records were preferred over duplicate remote entries because local copies are faster and more reliable.

Some local records refer to game folders that were visible in the user's existing installation but were not physically present in the supplied project archive. Copy those folders into `public/games` before deployment and run:

```bash
npm run sync-games
```
