
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
  mask.style.height = "200px";
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
    function getPathTo(element) {
      // if (element.id!=='')
      //     return 'id("'+element.id+'")';
      if (element===document.body)
          return element.tagName;

      var ix= 0;
      var siblings= element.parentNode.childNodes;
      for (var i= 0; i<siblings.length; i++) {
          var sibling= siblings[i];
          if (sibling===element)
              return getPathTo(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']';
          if (sibling.nodeType===1 && sibling.tagName===element.tagName)
              ix++;
      }
  }    

        function getNoticias(element,paths,padre){
            //preguntar tmb por si el padre tiene mas hijos o si el h2 tiene hermanos p
            console.log(element)
            var siblings = element.parentNode.childNodes;
            if (siblings.length>1){
              for (var i= 0; i<siblings.length; i++) {
                var sibling= siblings[i];
                if(sibling.tagName === "A"){
                  padre=element.parentNode;
                }
              }
              if(padre){
                console.log(padre.tagName)
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


  var seleccion;        
  mask.ondragover = function(e){
    e.preventDefault()
  };

  mask.ondrop = function(e){

    if(!seleccion){
      alert("Primero se debe seleccionar una opcion");
    }
    else{
      var elemento = e.dataTransfer.getData("text");
      if(seleccion === "notice"){
        //Falta meter la funcion que trae todos los elementos p del contenido, aca solo mando el path de un titulo arrastrado
        iframe.contentWindow.postMessage(elemento, "*");
        seleccion="";
      }else{
        var paths=[];
        var padre;
        getNoticias(getElementByXpath('//' + elemento),paths,padre);
        console.log(paths);
        iframe.contentWindow.postMessage(paths, "*");
        seleccion="";
      }
    }
    //Crear funciones dependiendo de lo que seleccione el usuario en la extension: si selecciona 
    //noticia, hacer el postmessage con el string, si selecciona seccion, postmessage con el array, etc
    //iframe.contentWindow.postMessage(getElementByXpath('//' + elemento).textContent,"*");
  };

  window.addEventListener('message', (e) => seleccion=e.data );//console.log(e.data)


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
