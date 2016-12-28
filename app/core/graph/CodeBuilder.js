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

    return this;
  }

  startMarker(){
    this.startMarkerChar = this.actualCharPosition;
    this.startMarkerLine = this.lineCount;

    return this;
  }

  marker(nid, type = CodeMarker.NODE, charStart = this.startMarkerChar || this.lastCharPosition, charEnd = this.actualCharPosition, lineStart = this.startMarkerLine || this.lineCount, lineEnd = lineStart) {
    this.ranges.push({
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
    this.ranges.push({
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

  reset() {
    this.code = '';
    this.ranges = [];
    this.lineCount = 0;
    this.lastCharPosition = 0;
    this.actualCharPosition = 0;

    this.startMarkerChar = 0;
    this.startMarkerLine = 0;
  }

  getCode() {
    const countedLines = countLines(this.code);
    if(countedLines != this.lineCount){
      console.warn('CodeBuilder: The generated code has ' + countedLines + ' lines, but the builder was informed only about ' + this.lineCount + ' of them!');
    }

    return this.code;
  }

  getMarkers(){
    return this.ranges
  }
}
