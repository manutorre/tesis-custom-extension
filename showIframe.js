
if (!document.getElementById("iframe-extension")) {
  var iframe = document.createElement('iframe');
  iframe.src = chrome.extension.getURL("contentParser/index.html");
  iframe.sandbox = "allow-scripts allow-modals allow-popups allow-same-origin";
  iframe.style.position = "fixed";
  iframe.style.right = "50px";
  iframe.style.top = "50px";
  iframe.style.height = "500px";
  iframe.style.zIndex = "10000";
  iframe.id = "iframe-extension";
  document.body.appendChild(iframe);

  var mask = document.createElement('div');
  mask.style.position = "fixed";
  mask.style.height = "203px";
  mask.style.width = "314px";
  mask.id = "iframe-mask";
  mask.style.display = "none";
  mask.style.zIndex = "10001";
  mask.style.right = "50px";
  mask.style.top = "50px";
  var urlString = chrome.extension.getURL('Drag-elements.jpg');
  var img = document.createElement('img');
  img.src = urlString
  mask.appendChild(img)
  document.body.appendChild(mask);


  var getElementByXpath = function(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; 
  }

  function getPathTo(element){
    return WebInspector.DOMPresentationUtils.xPath(element, true)
  }

  mask.ondragstart = function(e) {
    e.preventDefault()
    e.stopPropagation();
    e.dataTransfer.setData("text", e.target.id);
  };

  mask.ondragenter = function(e){
    e.preventDefault()
    e.stopPropagation();
  };  

  mask.ondragover = function(e){
    e.preventDefault()
    e.stopPropagation();
  };
  
  mask.ondragend = function(e){
    e.preventDefault()
    e.stopPropagation();
  };  

  var seleccion;
  mask.ondrop = function(e){
    e.preventDefault()
    e.stopPropagation();    
    if(!seleccion){
      alert("Primero se debe seleccionar una opcion");
    }
    else{
        const elemento = e.dataTransfer.getData("text").toLowerCase();
        if (seleccion.mge === "titleAndLinkRecognizing") {
          const elem = getElementByXpath('//' + elemento)
          const titleText = elem.textContent
          const link = elem.closest("a")

          iframe.contentWindow.postMessage(
            {
              type:"titleAndLink",
              title:{
                type:"title",
                data:elemento,
                text:titleText
              },
              link:{
                urlPagina: document.URL,
                type:"link",
                data: (link != null) ? getPathTo(link).toLowerCase() : getPathTo(elem),
                url:link.getAttribute('href'),
                tagName: link.closest("article") != null ? link.closest("article").tagName : link.tagName,
                className: link.closest("article") != null ? link.closest("article").getAttribute("class") : 
                           link.parentNode.closest("[class]").getAttribute("class") != null ? link.parentNode.closest("[class]").getAttribute("class") : link.getAttribute("class") 
              }
            }
            , "*");
        }
        
      }
  };

  window.addEventListener('message', (e) => {
    seleccion=e.data
    handleMessage(seleccion)
  });

  function handleMessage(message){
    switch (message.mge) {
      case "hideMask":
        mask.style.display = "none"
        iframe.style.display = "block"
        break;
      case "showMask":
        mask.style.display = "block"
        iframe.style.display = "none"
        break;
      case "maskForNewContent":
        mask.style.display = "block"
        iframe.style.display = "none"
        break;
      case "className":
        const siblingsClass = [...document.getElementsByClassName(message.elem)]
        const siblings=[];
        siblingsClass.map((content,index)=>{
          siblings[index] = getPathTo(content)
        })
        iframe.contentWindow.postMessage({type:"className",pathsElem:siblings},"*")
      break;
      case "tagName":
        const siblingsTag = [...document.getElementsByTagName(message.elem)]
        const siblingsT=[];
        siblingsTag.map((content,index)=>{
          siblingsT[index] = getPathTo(content)
        })
        iframe.contentWindow.postMessage({type:"tagName",pathsElem:siblingsT},"*")
      break;
      default:
    }
  }
}
else{
  if (document.getElementById("iframe-extension").style.visibility == "hidden") {
    document.getElementById("iframe-extension").style.visibility = "visible"
  }
  else{
    document.getElementById("iframe-extension").style.visibility = "hidden"
  }
}

