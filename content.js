document.onreadystatechange = function () {
  const bla = document.querySelectorAll("h1, h2, h3, p, a")
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
