class App {
  constructor() {
    this.index = 0;
    this.currentSelection = null;

    // Get any existing selections in LocalStorage and render them.
    this.selections = this.getSelections();
    this.renderSelections(this.selections);

    this.hitPos = {top: 0, left: 0};
    this.$plan = $('#plan');
    this.resetSelection();

    const self = this;
    this.$plan.mousedown(e => {
      e.preventDefault();
      // Bind the mousemove and mouseup to handle the drag and select
      self.$plan.mousemove(self._moveSelection.bind(self));
      self.$plan.mouseup(self._endSelection.bind(self));
      self.$plan.mouseleave(self._endSelection.bind(self));
      self._startSelection(e);
    });

    // Handle file uploads. Currently, it opens it in client-side. No server send.
    $('#plan-file').change(e => {
      if (e.target.files && e.target.files.length > 0) {
        const reader = new FileReader();
        reader.onload = e => $('#plan-img').attr('src', e.target.result);
        reader.readAsDataURL(e.target.files[0]);
      }
    });
  }

  saveSelection(id, value) {
    this.selections[id] = value;
    localStorage.setItem(id, JSON.stringify(value));
  }

  removeSelection(id) {
    delete this.selections[id];
    localStorage.removeItem(id);
  }

  getSelections() {
    // Get selections stored in LocalStorage
    var data = {};
    for (var i = 0; i < localStorage.length; ++i) {
      const value = JSON.parse(localStorage.getItem(localStorage.key(i)));
      data[localStorage.key(i)] = value;
    }
    return data;
  }

  renderSelections(selections) {
    const self = this, $plan = $('#plan');
    for (var id in selections) {
      const pos = selections[id];
      $plan.append(this.getSelectionDiv(id, false));
      $(`#selection_${id}`).css({
        top: pos.top,
        left: pos.left,
        width: `${pos.width}px`,
        height: `${pos.height}px`,
      });
    }
    this.attachCloseListenersToSelections(selections);
  }

  attachCloseListenersToSelections(selections) {
    for (var id in selections) {
      const self = this;
      $(`#selection_close_${id}`).click(function(id) {
        return e => {
          e.preventDefault();
          const $selection = $(`#selection_${id}`);
          self.removeSelection(id);
          $selection.remove();
        };
      }(id));
    }
  }

  resetSelection() {
    if (this.$currentSelection) {
      this.$currentSelection.css({ top: 0, left: 0, width: 0, height: 0 });
    }
  }

  getSelectionDiv(id, hidden=true) {
    const display = hidden ? 'none' : 'block';
    return $(`<div id='selection_${id}' class='select-box'><div id='selection_close_${id}' class='select-close-button' style='display: ${display}'>x</div></div>`);
  }

  _addSelection() {
    const $plan = $('#plan'), id = ++this.index,
          $selection = this.getSelectionDiv(id);
    $plan.append($selection);
    this.$currentSelection = $selection;
  }

  _startSelection(e) {
    const left = e.offsetX, top = e.offsetY;
    this._addSelection();
    this.hitPos.left = left;
    this.hitPos.top = top;
    this.$currentSelection.css({ left, top });
  }

  _moveSelection(e) {
    console.log(e.offsetX);
    const w = -(this.hitPos.left - e.offsetX), h = -(this.hitPos.top - e.offsetY);
    this.$currentSelection.css({ width: w, height: h });
  }

  _endSelection(e) {
    const closeId = `selection_close_${this.index}`, self = this;

    // If selection is insignificantly small, we don't select
    if (this.$currentSelection.width() < 10 ||
        this.$currentSelection.height() < 10) {
      this.$currentSelection.remove();
      return;
    }

    $(`#${closeId}`).show();

    // Attach close button handler
    $(`#${closeId}`).click(function(id) {
      return e => {
        e.preventDefault();
        const $selection = $(`#selection_${id}`);
        self.removeSelection(id);
        $selection.remove();
      };
    }(this.index));

    var selectionData = {
      top: this.$currentSelection.position().top,
      left: this.$currentSelection.position().left,
      width: this.$currentSelection.width(),
      height: this.$currentSelection.height(),
    }
    this.saveSelection(this.index, selectionData);

    this.$plan.unbind("mousemove");
    this.$plan.unbind("mouseup");
    this.$plan.unbind("mouseleave");
  }
}

const app = new App();
