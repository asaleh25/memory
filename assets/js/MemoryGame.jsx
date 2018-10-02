import React from 'react';
import ReactDOM from 'react-dom';
import shuffle from 'shuffle-array';
import TileImage from './TileImage'

export default function memory_init(root) {
  ReactDOM.render(<Memory />, root);
}

// App state for Memory Game is
// {
//    selectedTiles: the number of tiles currently selected
//    clicks: total number of clicks
//    firstTile: the id of the first tile selected
//    secondTile: the id of the second tile
// }

class Memory extends React.Component {
  constructor(props) {
    super(props);
    this.tileList = [];
    this.on_tile_click = this.on_tile_click.bind(this);
    this.reset_tiles = this.reset_tiles.bind(this);
    this.state = {
      selectedTiles: 0,
      clicks: 0,
      firstTile: undefined,
      secondTile: undefined
    }
  }

  componentWillMount() {
    this.create_tiles();
  }

  create_tiles() {
    let values = ["A", "B", "C", "D", "E", "F", "G", "H"];
    this.tileList = [];
    for(let i=0; i<16;i++) {
      let tile = {
        id: i,
        value: values[i % 8],
        matched: false,
        selected: false,
      }
      this.tileList.push(tile);
    }
    shuffle(this.tileList);
  }

  get_tile(id) {
    for (let i=0; i<16; i++) {
      if(this.tileList[i].id === id) {
        return this.tileList[i];
      }
    }
  }

  matching_tiles(tile1, tile2) {
    return this.get_tile(tile1).value === this.get_tile(tile2).value;
  }

  reset_tiles() {
    this.tileList.forEach(t => {
      t.selected = false;
      t.matched = false;
    })
    shuffle(this.tileList);
    this.setState({
      selectedTiles:0,
      clicks: 0,
      firstTile: undefined,
      secondTile: undefined
    });
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
    let tileImages = [];
    let onClick = this.on_tile_click;
    this.tileList.forEach(t => {
      let tileImg = <TileImage key={t.id} id={t.id} value={t.value} matched={t.matched}
          selected={t.selected} onClick={onClick}/>
          tileImages.push(tileImg);
    });
    return tileImages;
  }

  clear(tile1, tile2) {
    if(this.state.selectedTiles !== 2) {
      return;
    }
    this.select_tile(tile1, false);
    this.select_tile(tile2, false);
    this.setState({
      selectedTiles: 0,
      clicks: this.state.clicks,
      firstTile: undefined,
      secondTile: undefined
    });
  }

  on_tile_click(id, value) {
    if(this.state.selectedTiles === 0 || this.state.selectedTiles === 2) {
      if (this.state.selectedTiles === 2) {
        clearTimeout(this.timeout);
        this.clear(this.state.firstTile, this.state.secondTile);
      }
      this.select_tile(id, true);
      this.setState({
        selectedTiles: 1,
        firstTile: id,
        clicks: this.state.clicks + 1,
      });
    } else if (this.state.selectedTiles === 1) {
      this.select_tile(id, true);
      this.setState({
        selectedTiles: 2,
        secondTile: id,
        clicks: this.state.clicks + 1,
      });

      if(this.matching_tiles(id, this.state.firstTile)) {
        this.get_tile(id).matched = true;
        this.get_tile(this.state.firstTile).matched = true;
        this.setState({
          selectedTiles: 0,
          firstTile: undefined,
          secondTile: undefined
        })
      } else {
        this.timeout = setTimeout(() => {
          this.clear(this.state.firstTile, this.state.secondTile);
        }, 500);
      }
    }
  }


  render() {
    console.log(this.tileList)
    let grid = this.generate_tile_images();
    return (
      <div id="page">
        <div id="column">
          <h2>Memory Game</h2>
        </div>
        <div className="grid">
          {grid}
        </div>
        <div id = "bottom">
          <div id="reset"><button type="button" onClick={this.reset_tiles}>Reset</button></div>
          <div id = "score"><h3>Score: {this.state.clicks}</h3></div>
        </div>
      </div>
      );
  }
}
