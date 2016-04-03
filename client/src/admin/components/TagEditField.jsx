// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------

import React from 'react';

export default class TagEditField extends React.Component {
  static propTypes = {
    availableTags: React.PropTypes.array.isRequired,
    onTag: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {};

    this.onTagInputChange = this.onTagInputChange.bind(this);
    this.onTagInputKeyUp = this.onTagInputKeyUp.bind(this);
  }

  componentDidMount() {
    this.inputComponent = this.refs.tagInput;
  }

  onTagInputKeyUp(e) {
    if (e.keyCode === 8) {
      // don't handle backspaces
      return;
    }
    if (e.keyCode === 13) {
      if (!this.state.tagInput) {
        return;
      }

      this.props.onTag(this.inputComponent.value);
      this.setState({ tagInput: '' });
      this.inputComponent.focus();
    }

    // do autocomplete
    if (!this.inputComponent) {
      return;
    }
    const currentInputValue = this.inputComponent.value;
    const tag = this.findMatchingTag(currentInputValue);
    if (!tag) {
      return;
    }
    this.inputComponent.value = tag;
    this.inputComponent.setSelectionRange(currentInputValue.length, tag.length);
  }

  onTagInputChange(e) {
    this.setState({ tagInput: e.target.value });
  }

  findMatchingTag(value) {
    if (value === '') {
      return null;
    }

    const searchFor = value.toLowerCase();
    const tagFound = this.props.availableTags.find((tag) => {
      return tag.tag.toLowerCase().startsWith(searchFor);
    });

    return tagFound ? tagFound.tag : null;
  }

  render() {
    return <div className='EditorGroup'>
      <input ref='tagInput' type='text' className='Control' placeholder='Tags' onChange={this.onTagInputChange}
        onKeyUp={this.onTagInputKeyUp} value={this.state.tagInput}/>
    </div>;
  }
}

