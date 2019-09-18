
if (!document.getElementById("iframe-extension")) {
  var iframe = document.createElement('iframe');
  // iframe.src = chrome.extension.getURL("contentParser/index.html");
  iframe.src = "http://localhost:3000"
  iframe.sandbox = "allow-scripts allow-modals allow-popups";
  iframe.style.position = "fixed";
  iframe.style.right = "50px";
  iframe.style.top = "50px";
  iframe.style.height = "500px";
  iframe.style.zIndex = "500";
  iframe.id = "iframe-extension";
  document.body.appendChild(iframe);

  var mask = document.createElement('div');
  mask.style.position = "fixed";
  mask.style.height = "500px";
  mask.style.width = "300px";
  mask.id = "iframe-mask";
  //mask.background = "transparent";
  mask.style.display = "none";
  mask.style.zIndex = "501";
  mask.style.right = "50px";
  mask.style.top = "50px";
  var urlString = chrome.extension.getURL('Drag-elements.jpg');
  var img = document.createElement('img');
  img.src = urlString
  mask.appendChild(img)
  document.body.appendChild(mask);

//CREADO DE ELEMENTOS IFRAME Y MASK

  var getElementByXpath = function(path) {
    console.log(path)
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; 
  }

  function getPathTo(element){
    console.log(WebInspector.DOMPresentationUtils.xPath(element, true))
    return WebInspector.DOMPresentationUtils.xPath(element, true)
  }

  // function getPathTo(element) {
  //     // if (element.id!=='')
  //     //     return 'id("'+element.id+'")';
  //     if (element===document.body)
  //         return element.tagName;

  //     var ix= 0;
  //     var siblings= element.parentNode.childNodes;
  //     for (var i= 0; i<siblings.length; i++) {
  //         var sibling= siblings[i];
  //         if (sibling===element)
  //             return getPathTo(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']';
  //         if (sibling.nodeType===1 && sibling.tagName===element.tagName)
  //             ix++;
  //     }
  // }

  /*function getPathTo(element){
    console.log(element)
    if (element && element.id)
        return '//*[@id="' + element.id + '"]';
    else
        return getElementTreeXPath(element);  
  }

  function getElementTreeXPath(element){
    var paths = [];  // Use nodeName (instead of localName) 
    // so namespace prefix is included (if any).
    for (; element && element.nodeType == Node.ELEMENT_NODE; 
           element = element.parentNode)
    {
        var index = 0;
        var hasFollowingSiblings = false;
        for (var sibling = element.previousSibling; sibling; 
              sibling = sibling.previousSibling)
        {
            // Ignore document type declaration.
            if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
                continue;

            if (sibling.nodeName == element.nodeName)
                ++index;
        }

        for (var sibling = element.nextSibling; 
            sibling && !hasFollowingSiblings;
            sibling = sibling.nextSibling)
        {
            if (sibling.nodeName == element.nodeName)
                hasFollowingSiblings = true;
        }

        var tagName = (element.prefix ? element.prefix + ":" : "") 
                          + element.localName;
        var pathIndex = (index || hasFollowingSiblings ? "[" 
                   + (index + 1) + "]" : "");
        paths.splice(0, 0, tagName + pathIndex);
    }

    return paths.length ? "/" + paths.join("/") : null;
  }
  */

  /*function findElementInChilds(element,tag){
    if(element.tagName === tag){
        return element;
    }
    else{
      var children = element.childNodes
      if (children.length>0){
        for (var i= 0; i<children.length; i++) {
          var child= children[i];
          if(child.tagName === tag){
            return child;
          }
        }
      }
      return null;
    }
  }

  function findElement(element,tag){
    if(element.tagName === tag){
        return element;
    }
    else{
        var siblings = element.parentNode.childNodes;
        if (siblings.length>1){
          for (var i= 0; i<siblings.length; i++) {
            var sibling= siblings[i];
            if(sibling.tagName === tag){
              return sibling;
            }
          }
          return findElement(element.parentNode,tag);
        }
      }
  }
  */
  mask.ondragstart = function(e) {
    e.preventDefault()
    e.stopPropagation();
    console.log(e.target.id)
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
    console.log(e)
    e.preventDefault()
    e.stopPropagation();    
    if(!seleccion){
      alert("Primero se debe seleccionar una opcion");
    }
    else{
        const elemento = e.dataTransfer.getData("text").toLowerCase();
        if (seleccion.mge === "titleAndLinkRecognizing") {
          const elem = getElementByXpath('//' + elemento)
          console.log(elem)
          const titleText = elem.textContent
          console.log(titleText)
          const link = elem.closest("a")

          // const link = (findElementInChilds(elem,"A") != null) ? findElementInChilds(elem,"A") : findElement(elem,"A") 
          
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
                data: getPathTo(link).toLowerCase(),
                url:link.getAttribute("href"),
                tagName: link.closest("article") != null ? link.closest("article").tagName : link.tagName,
                // tagName:(findElement(elem,"ARTICLE").tagName == "ARTICLE") ? "ARTICLE" : link.tagName,
                className: link.closest("article") != null ? link.closest("article").getAttribute("class") : 
                           link.parentNode.closest("[class]").getAttribute("class") != null ? link.parentNode.closest("[class]").getAttribute("class") : link.getAttribute("class") 
                // className:(link.getAttribute("class"))? link.getAttribute("class") : findElement(elem,'DIV').getAttribute("class")
              }
            }
            , "*");
        }
        
      }
  };

  window.addEventListener('message', (e) => {
    seleccion=e.data
    console.log("seleccion ",seleccion)
    handleMessage(seleccion)
  });//console.log(e.data)

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



/*

function getNoticias(element,paths,padre){
      //preguntar tmb por si el padre tiene mas hijos o si el h2 tiene hermanos p
      var siblings = element.parentNode.childNodes;
      if (siblings.length>1){
        for (var i= 0; i<siblings.length; i++) {
          var sibling= siblings[i];
          if(sibling.tagName === "A"){
            padre=element.parentNode;
          }
        }
        if(padre){
          var elementos = document.getElementsByTagName(padre.tagName);
          for (var i= 0; i<elementos.length; i++) {
            var noticia = elementos[i];
            if (typeof DeepDiff(noticia.childNodes,padre.childNodes) == "undefined") {
              noticia.style.backgroundColor = "red";
              paths.push(getPathTo(noticia));
            }
          }
        }else{
          getNoticias(element.parentNode,paths,padre);
        }
      }else{
        getNoticias(element.parentNode,paths,padre);
      }
    }


// window.onmessage = function(e){
//     if (e.data == 'hello') {
//         alert('It works!');
//     }
// };

    // if (seleccion === "titleRecognizing") {
    //   const elementText = getElementByXpath('//' + elemento).textContent
    //   iframe.contentWindow.postMessage(
    //     {
    //       type:"title",
    //       data:elemento,
    //       text:elementText
    //     }, "*");
    // }
    // if (seleccion === "linkRecognizing") {
    //   const elementText = findElementA(getElementByXpath('//' + elemento)).getAttribute("href")
    //   iframe.contentWindow.postMessage(
    //     {
    //       type:"link",
    //       data:elemento,
    //       text:elementText
    //     }, "*");
     

    if(seleccion === "notice"){
      var elementA = findElementA(getElementByXpath('//' + elemento)).getAttribute("href");//Obtengo el link del <a>
      var popup = window.open(elementA, '_blank', 'width=500,height=500');//Puede cargar en un pop-up o en una nueva pestaña

      popup.onload = function() {
        setTimeout(function(){
          //console.log(popup.document.documentElement.outerHTML)

          //Marca en rojo todos los p hermanos buscando desde el body
          var nodeMax;
          var maxP = 0;
          var contenido="";
          var walkDOM = function (node,func) {
              func(node);
              node = node.firstElementChild;
              while(node) {
                walkDOM(node,func);
                node = node.nextElementSibling;
                if(node == popup.document.body.lastElementChild){
                  var siblings = nodeMax.getElementsByTagName("P");
                  for (var i= 0; i<siblings.length; i++) {
                    var sibling= siblings[i];
                    contenido +=sibling.textContent+"\n";
                    //sibling.style.backgroundColor = "red";
                  }
                  console.log("Contenido: ",contenido);
                  iframe.contentWindow.postMessage(contenido, "*");
                  popup.close();
                }
              }
          };

          walkDOM(popup.document.body,function(node) {
            var childs = node.children;
            var cantP=0;
            for (var i= 0; i<childs.length; i++) {
              var child= childs[i];
              if(child.tagName==="P") //Tener en cuenta tmb los text: child.nodeType===3 ||
                cantP+=1;
            }
            if(cantP > maxP){
              maxP = cantP;
              nodeMax = node;
            }
          });
        }, 2000);
      }
      
      seleccion="";
    }else{
      var paths=[];
      var padre;
      getNoticias(getElementByXpath('//' + elemento),paths,padre);
      iframe.contentWindow.postMessage(paths, "*");
      seleccion="";
    }*/
  
    //Crear funciones dependiendo de lo que seleccione el usuario en la extension: si selecciona
    //noticia, hacer el postmessage con el string, si selecciona seccion, postmessage con el array, etc
    //iframe.contentWindow.postMessage(getElementByXpath('//' + elemento).textContent,"*");
  