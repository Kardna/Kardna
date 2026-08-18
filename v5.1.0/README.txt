Replace these two files in your frontend folder:

- sw.js
- scram-launcher.js

Why:
1. The service worker was intercepting Scramjet's own local assets under /scram/, /baremux/, and /libcurl/.
2. That caused /scram/scramjet.all.js to fail before $scramjetLoadController could exist.
3. The frame method should use frame.go(...) in current Scramjet docs.

After replacing:
1. Hard refresh the page
2. In DevTools > Application > Service Workers, unregister old workers if needed
3. Reload scram.html again
