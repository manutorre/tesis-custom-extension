function eventHandler() {
  console.log("------Llama------")
  const bla = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, a, article")
  function getPathTo(element) {

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

  bla.forEach(function(item,index,array){
    item.setAttribute('draggable', true);
    item.ondragover = function(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    item.ondragend = function(e){
      e.preventDefault();
      e.stopPropagation();
    }
    item.ondragenter = function(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    item.ondrop = function(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    item.ondragstart = function(e) {
      e.dataTransfer.setData("text", getPathTo(e.target))
    };
    
    if(index === array.length - 1){
      setTimeout(function(){
        eventHandler()},20000)
    }
  },this) 

}

document.onload = eventHandler()
