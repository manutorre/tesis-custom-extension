document.onreadystatechange = function () {
  const bla = document.querySelectorAll("h1, h2, h3, p")
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
      var nodeMax;
      var maxP = 0;
      var walkDOM = function (node,func) {
          func(node);
          node = node.firstElementChild;
          while(node) {
            walkDOM(node,func);
            node = node.nextElementSibling;
            if(node == document.body.lastElementChild){
              var siblings = nodeMax.getElementsByTagName("P");
              for (var i= 0; i<siblings.length; i++) {
                var sibling= siblings[i];
                sibling.style.backgroundColor = "red";
              }
            }
          }
      };

      walkDOM(document.body,function(node) {
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
