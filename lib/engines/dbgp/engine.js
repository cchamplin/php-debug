'use babel'

import helpers from '../../helpers'
import DebugEngine from '../../models/debug-engine'
export default class PHPDebugEngine extends DebugEngine {
  getVariableLabels (variable, parent) {
    let labels = [];
    let identifierClasses = 'variable php syntax--php';
    if (!variable.label && variable.name) {
      var identifier = variable.name;
    } else {
      var identifier = variable.label;
    }
    const numericIdentifier = /^\d+$/.test(identifier)
    if (!parent) { // root taxonomy (Locals,Globals)
      identifierClasses += ' syntax--type'
    } else if (parent == 'User derfined constants') {
      identifierClasses += ' syntax--constant'
    } else if (parent.indexOf('.') == -1) { // Variable
      identifierClasses += ' syntax--variable'
    } else {
      identifierClasses += ' syntax--property'
      if (numericIdentifier) {
        identifierClasses += ' syntax--constant syntax--numeric'
      } else {
        identifierClasses += ' syntax--string'
      }
      label = '"' + identifier + '"'
    }

    let typeClasses = 'type php syntax--php syntax--' + variable.type;
    switch (variable.type) {
      case "array":
        typeClasses += ' syntax--support syntax--function'
        break;
      case "object":
        typeClasses += ' syntax--entity syntax--name syntax--type'
        break;
    }

    labels.push({text:identifier,classes:identifierClasses})
    if (variable.type) {
      switch (variable.type) {
        case "array":
          labels.push({text:'array[' + (variable.length ? variable.length : variable.value.length) + ']',classes:typeClasses});
          break;
        case "object":
          labels.push({text:'object',classes:typeClasses});
          labels.push({text:"["+variable.className+"]",classes:'variable php syntax--php syntax--entity syntax--name syntax--class'});
          break;
      }

      let value = null;
      let valueClasses = 'syntax--php';
      switch (variable.type) {
        case "string":
          valueClasses += ' syntax--quoted syntax--string syntax--double '
          value = '"' + helpers.escapeHtml(variable.value) + '"';
          break;
        case 'resource':
        case 'error':
          valueClasses += ' syntax--quoted syntax--double syntax--constant'
          value = '"' + helpers.escapeHtml(variable.value) + '"';
          break;
        case 'bool':
          if (variable.value == 0) {
            value = 'false'
          } else {
            value = 'true';
          }
          valueClasses += ' syntax--constant syntax--language syntax--bool'
          break;
        case 'null':
          value = 'null';
          valueClasses += ' syntax--constant syntax--language syntax--null'
          break;
        case 'numeric':
          value = variable.value;
          valueClasses += ' syntax--constant syntax--numeric'
          break;
        case 'uninitialized':
          value = '?';
          valueClasses += ' syntax--constant syntax--language'
          break;
      }
      if (value) {
        labels.push({text:value,classes:valueClasses})
      }
    }



    return labels;
  }
}
