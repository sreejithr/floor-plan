import jQuery from 'jquery';

class App {
  constructor() {
    this.hitPos = {top: 0, left: 0};
    this.$selectBox = $('#select-box');
    this.$plan = $('#plan');

    this.resetSelection();

    const self = this;
    this.$plan.mousedown(e => {
      e.preventDefault();
      // Bind the move and mouseup to handle the drag and select
      self.$plan.mousemove(self._moveSelection.bind(self));
      self.$plan.mouseup(self._endSelection.bind(self));
      self._startSelectionAt(e.pageX, e.pageY);
    });
  }

  resetSelection() {
    this.$selectBox.left = 0;
    this.$selectBox.top = 0;
    this.$selectBox.width = 0;
    this.$selectBox.height = 0;
  }

  _startSelectionAt(x, y) {
    this.hitPos.left = x;
    this.hitPos.top = y;
    this.$selectBox.left = x;
    this.$selectBox.top = y;
  }

  _moveSelection(e) {
    const w = -(this.hitPos.left - e.pageX), h = -(this.hitPos.top - e.pageY);
    this.$selectBox.width = w;
    this.$selectBox.height = h;
  }

  _endSelection(e) {
    this.$plan.unbind("mousemove", this._moveSelection.bind(this));
    this.$plan.unbind("mouseup", this._endSelection.bind(this));
    this.resetSelection();
  }
}

const app = new App();

//# sourceMappingURL=app.js.map
