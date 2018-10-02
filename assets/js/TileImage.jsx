import React from 'react';
import ReactDOM from 'react-dom';

class TileImage extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    if(!this.props.matched && !this.props.selected) {
      this.props.onClick(this.props.id, this.props.value);
    }
  }

  render() {
    // let text = this.props.value;
    let text = "";
    let className = "unsel";
    if (this.props.selected) {
      text = this.props.value;
    }

    if (this.props.matched) {
      className = "matched";
    }
    if (!this.props.matched) {
      className = "unsel";
    }

    return (
      <div className={className} onClick={this.onClick}>{text}</div>
    )
  }
}

export default TileImage;
