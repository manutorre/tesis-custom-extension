document.onreadystatechange = function () {
  const bla = document.querySelectorAll("h1, h2, h3, p, a, header")
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
  Array.prototype.forEach.call(bla, function(item){
    // item.style.backgroundColor = "red";
    item.setAttribute('draggable', true);

    item.ondragstart = function(e) {
    	var target=e.target;
          //Marca en rojo todos los p hermanos buscando desde el body
            var walkDOM = function (node,func) {
                      func(node);
                      node = node.firstChild;
                      while(node) {
                          walkDOM(node,func);
                          node = node.nextSibling;
                      }

                  };
                walkDOM(document.body,function(node) {

                      var childs = node.childNodes;
                      var cantP=0;
                        for (var i= 0; i<childs.length; i++) {
                            var child= childs[i];
                            if(child.tagName==="P") //Tener en cuenta tmb los text: child.nodeType===3 ||
                              cantP+=1;
                        }
                        if(cantP>=2){
                          var siblings = node.getElementsByTagName("P");
                          for (var i= 0; i<siblings.length; i++) {
                            var sibling= siblings[i];
                            sibling.style.backgroundColor = "red";
                          }
                        }
                  });


          var padre;
          function getNoticias(element){
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
                  }
                }
              }else{
                getNoticias(element.parentNode);
              }
            }else{
              getNoticias(element.parentNode);
            }
          }

          getNoticias(target);

      	  e.dataTransfer.setData("text", getPathTo(e.target))
    };
  })
}
// window.onload = function() {
//     var iframe = document.createElement('iframe');
//     iframe.src = "https://twitter.com";
//     iframe.style.position = "absolute";
//     document.body.appendChild(iframe);
// };
