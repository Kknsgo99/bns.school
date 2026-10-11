/* Service Worker: ให้ติดตั้งเป็นแอป (PWA) และเปิดหน้าเว็บได้แม้สัญญาณหลุดชั่วคราว
 * - เก็บเฉพาะไฟล์ของเว็บเอง (หน้าเว็บ/รูปแบบเสื้อ/QR/ไอคอน) ไม่เก็บข้อมูลลูกค้าและไม่แตะคำขอไปยัง Apps Script
 * - network-first: ได้หน้าเว็บเวอร์ชันล่าสุดเสมอเมื่อออนไลน์ แก้ไฟล์แล้วไม่ต้องล้างแคช */
var V = 'shirt-v1', ASSETS = ['./', 'index.html', 'design.jpg', 'qr.jpg', 'manifest.webmanifest', 'icon-192.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(V).then(function (c) { return c.addAll(ASSETS); }).catch(function () {}).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); })); })
    .then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(fetch(r).then(function (res) {
    if (res && res.ok) { var cp = res.clone(); caches.open(V).then(function (c) { c.put(r, cp); }); }
    return res;
  }).catch(function () { return caches.match(r).then(function (m) { return m || caches.match('index.html'); }); }));
});
