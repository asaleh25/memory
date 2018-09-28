import React from 'react';
import ReactDOM from 'react-dom';
import shuffle from 'shuffle-array';

export default function memory_init(root) {
  ReactDOM.render(<Memory />, root);
}

// App state for Memory Game is
// {
//    tiles: a list of tiles
//    clicks: number of clicks taken to guess
// }

class Memory extends React.Component {
  constructor(props) {
    super(props);
    this.on_click = this.on_click.bind(this);
    this.reset_tiles = this.reset_tiles.bind(this);
    this.state = {
      tiles: [],
      clicks: 0,
    }
  }

  create_tiles() {
    let values = ["A", "B", "C", "D", "E", "F", "G", "H"];
    for(let i=0; i<16;i++) {
      let tile = {
        id: i,
        value: values[i % 8],
        matched: false,
        selected: false,
      }
      this.state.tiles.push(tile);
    }
    shuffle(this.state.tiles);
  }

  get_tile(id) {
    for (let i=0; i<16; i++) {
      if(this.tiles[i].id === id) {
        return this.tiles[i];
      }
    }
  }

  matching_tiles(tile1, tile2) {
    if (this.tiles.get_tile(tile1) === this.tiles.get_tile(tile2)) {
      this.tiles.get_tile(tile1).matched = true;
      this.tiles.get_tile(tile2).matched = true;
      return true;
    } else {
      return false;
    }
  }

  reset_tiles() {
    let prevTiles = this.state.tiles;
    for (let i=0; i<16;i++) {
      prevTiles[i].matched = false;
      prevTiles[i].selected = false;
    }
    this.setState({
      tiles: shuffle(prevTiles),
      score: 0,
    })
  }

  select_tile(id, select) {
    this.get_tile(id).selected = select;
  }

  count_matches() {
    let count = 0;
    for(let i=0; i<16; i++) {
      if (this.get_tile(i).matched === true) {
        count = count + 1;
      }
    }
    return count;
  }

  generate_tile_images() {
    let tileImage = [];
    this.state.tiles.forEach(c => {
      let t = <div key={c.id} className="unsel" onClick={this.on_click}></div>;
      tileImage.push(t);
    })
    return tileImage;
  }

  on_click() {
    this.setState((prevState) => ({
      score: prevState.score + 1
    }));
  }


  render() {
    this.create_tiles();
    let grid = this.generate_tile_images();
    return (
      <div id="page">
        <div id="column">
          <h2>Memory Game</h2>
        </div>
        <div className="grid">
          {grid}
        </div>
        <div id="reset">
          <button type="button" onClick={this.reset_tiles}>Reset</button>
        </div>
      </div>
      );
  }
}
