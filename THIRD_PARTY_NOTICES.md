# Third-party notices and provenance

## Derived code: fullstack-chat-app (MIT)

Parts of Nook's backend follow the structure and patterns of
[burakorkmez/fullstack-chat-app](https://github.com/burakorkmez/fullstack-chat-app), including the
`users` and `messages` model shape, the message route and controller layout, the seed script, and the
in-memory `userId -> socketId` presence map in the Socket.IO module. That project is licensed under the
MIT License, reproduced here as the license requires:

```
MIT License

Copyright (c) 2024 Burak

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Media assets with unconfirmed provenance

The source of the following committed files has not been established, so no license is claimed for them
and they are not covered by any license offered for this repository:

- `frontend/public/wallpapers/*.jpg` (13 images)
- `frontend/public/sounds/keystroke1.mp3` to `keystroke4.mp3`

Before the repository is given an open-source license, each file should either be shown to have a
license that permits redistribution (and be credited here) or be replaced with an original or
properly licensed alternative.

## Dependencies

npm dependencies keep their own licenses; see `backend/package.json` and `frontend/package.json`.
