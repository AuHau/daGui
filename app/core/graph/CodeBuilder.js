import CodeMarker from 'shared/enums/CodeMarker';

const countLines = (string) => {
  return (string.match(/\n/g)||[]).length
};

export default class CodeBuilder {
  constructor() {
    this.reset();
  }

  add(code){
    if(!code && arguments.length == 1) return this;
    if(Array.isArray(code) || arguments.length > 1){
      const iterateOver = (Array.isArray(code) ? code : arguments);
      for(let arg of iterateOver){
        this.add(arg);
      }

      return this;
    }

    if(code.includes('\n')){
      throw new Error('String passed to \'add\' cannot contain new line characters! For new line use breakLine()!');
    }

    this.lastCharPosition = this.actualCharPosition;
    this.actualCharPosition += code.length;
    this.code += code;
    this.codeChanged = true;

    return this;
  }

  startMarker(){
    this.startMarkerChar = this.actualCharPosition;
    this.startMarkerLine = this.lineCount;

    return this;
  }

  marker(nid, type = CodeMarker.NODE, charStart = this.startMarkerChar || this.lastCharPosition, charEnd = this.actualCharPosition, lineStart = this.startMarkerLine || this.lineCount, lineEnd = lineStart) {
    this.markers.push({
      lineStart,
      lineEnd,
      charStart,
      charEnd,
      nid,
      type
    });

    this.markersChanged = true;
    return this;
  }

  finishMarker(nid, type = CodeMarker.NODE){
    this.markers.push({
      lineStart: this.startMarkerLine,
      lineEnd : this.lineCount,
      charStart: this.startMarkerChar,
      charEnd: this.actualCharPosition,
      nid,
      type
    });

    this.startMarkerChar = 0;
    this.startMarkerLine = 0;

    this.markersChanged = true;
    return this;
  }

  getLastMarkerIndex(){
    return this.markers.length - 1;
  }

  mergeMarkers(index1, index2){
    // TODO: [Low] Add intelligant comparsment of start/end of chars and lines
    this.markers[index1].charEnd = this.markers[index2].charEnd;
    this.markers.splice(index2, 1);
  }

  breakLine() {
    this.code += '\n';
    this.lineCount++;
    this.lastCharPosition = 0;
    this.actualCharPosition = 0;

    return this;
  }

  reset() {
    this.code = '';
    this.markers = [];
    this.lineCount = 0;
    this.lastCharPosition = 0;
    this.actualCharPosition = 0;

    this.startMarkerChar = 0;
    this.startMarkerLine = 0;

    this.markersChanged = true;
    this.codeChanged = true;
  }

  getCode() {
    const countedLines = countLines(this.code);
    if(countedLines != this.lineCount){
      console.warn('CodeBuilder: The generated code has ' + countedLines + ' lines, but the builder was informed only about ' + this.lineCount + ' of them!');
    }

    this.codeChanged = false;
    return this.code;
  }

  didCodeChanged() {
    return this.codeChanged;
  }

  getMarkers(){
    this.markersChanged = false;
    return this.markers
  }

  didMarkersChanged() {
    return this.markersChanged;
  }
}
