# Owner-Selected Featured Artwork Integration

## Selected reference

The project owner selected this ChatGPT share reference:

```text
https://chatgpt.com/s/m_6a68a8d1088481919dcffce0963b43db
```

The share page is not used as an image URL because it is an application page, can require session access, and is not a stable production asset.

## Production target

Upload the original image file to:

```text
client/public/assets/divyanexus/owner-selected-vision.webp
```

Recommended production export:

- WebP
- 1920 × 1080 or larger
- landscape composition
- under 900 KB where quality permits
- no embedded private data
- no external hotlink

## Activation

Update `client/src/data/portalArtwork.ts`:

```ts
assetPath: "/assets/divyanexus/owner-selected-vision.webp",
readyForProduction: true,
```

`PortalArtworkPanel` remains hidden until both conditions are satisfied. This prevents a broken section, a private-share dependency, or substitution with the wrong image.

## Verification

- Image returns HTTP 200.
- MIME type is an image format.
- Desktop focal area remains clear behind text.
- Mobile crop is acceptable at 320, 375, 390, and 430 pixels.
- Alternative text describes the actual image.
- No visible watermark, account information, or private conversation text remains.
- Playwright confirms the section appears only when activated.

## Current status

The integration contract and portal component are complete. The exact image file is still required because the share link could not be retrieved as a production image asset.
