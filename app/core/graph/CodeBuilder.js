import CodeMarker from 'shared/enums/CodeMarker';

const countLines = (string) => {
  return (string.match(/\n/g)||[]).length
}

export default class CodeBuilder {
  constructor() {
    this.code = '';
    this.markers = [];
    this.lineCount = 1;
    this.lastCharPosition = 0;
    this.actualCharPosition = 0;

    this.startMarkerChar = 0;
    this.startMarkerLine = 0;
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

    this.lastCharPosition = this.actualCharPosition;
    this.actualCharPosition += code.length;
    this.code += code;

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

    return this;
  }

  breakLine() {
    this.code += '\n';
    this.lineCount++;
    this.lastCharPosition = 0;
    this.actualCharPosition = 0;

    return this;
  }

  getCode() {
    const countedLines = countLines(this.code);
    if(countedLines != this.lineCount){
      console.warn('CodeBuilder: The generated code has ' + countedLines + ' lines, but the builder was informed only about ' + this.lineCount + ' of them!');
    }

    return this.code;
  }

  getMarkers(){
    return this.markers
  }
}
