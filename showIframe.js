
if (!document.getElementById("iframe-extension")) {
  var iframe = document.createElement('iframe');
  iframe.src = "http://localhost:3000";
  iframe.sandbox = "allow-scripts";
  iframe.style.position = "fixed";
  iframe.style.right = "50px";
  iframe.style.top = "50px";
  iframe.style.height = "500px";
  iframe.id = "iframe-extension";
  document.body.appendChild(iframe);

  var mask = document.createElement('div');
  mask.style.position = "fixed";
  mask.style.right = "50px";
  mask.style.top = "50px";
  mask.style.height = "500px";
  mask.style.width = "300px";
  mask.id = "iframe-mask";
  mask.background = "transparent"
  document.body.appendChild(mask);

  var getElementByXpath = function(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }
  // mask.ondragstart = function(e) {
  //   console.log(e.target.id)
  //   e.dataTransfer.setData("text", e.target.id);
  // };
  mask.ondragover = function(e){
    e.preventDefault()
  };

  mask.ondrop = function(e){
    var elemento = e.dataTransfer.getData("text");
    const domToTransfer = getElementByXpath('//' + elemento)
    iframe.contentWindow.postMessage(elemento, "*")
  };

}
else{
  if (document.getElementById("iframe-extension").style.visibility == "hidden") {
    document.getElementById("iframe-extension").style.visibility = "visible"
  }
  else{
    document.getElementById("iframe-extension").style.visibility = "hidden"
  }
}
// window.onmessage = function(e){
//     if (e.data == 'hello') {
//         alert('It works!');
//     }
// };
