import jq from 'jquery';

function component() {
    var element = document.createElement('div');
    element.id = "myDiv";

    // jquery, now imported by this script
    element.innerHTML = ['Hello', 'webpack'].join(' ');

    return element;
  }

  document.body.appendChild(component());