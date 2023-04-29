var iframe = document.createElement('iframe');
var html = '<body>Foo</body>';
iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html);
document.body.appendChild(iframe);
console.log('iframe.contentWindow =', iframe.contentWindow);
