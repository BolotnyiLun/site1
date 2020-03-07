import $ from 'jquery';
import Popper from 'popper.js';
import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import * as s from './App.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import Select from 'react-select';
//import { Map, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
//import MarkerClusterGroup from 'react-leaflet-markercluster';
import ReactExport from 'react-export-excel';
import YandexMap from './YMap';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import * as moment from 'moment';

//import './App.css';


const columns_main = [
  {
    dataField: 'date',
    text: 'Дата, время',
    sort: true
  },
  {
    dataField: 'point_id',
    text: 'Point ID',
    hidden: false
  }, {
    dataField: 'lat',
    text: 'Широта',
    sort: true
  }, {
    dataField: 'lon',
    text: 'Долгота',
    sort: true
  },  {
    dataField: 'order',
    text: 'Отряд',
    sort: true
  }, {
    dataField: 'species',
    text: 'Вид',
    sort: true
  }, {
    dataField: 'sp_num',
    text: 'Количество особей',
    sort: true
  }, {
    dataField: 'pull',
    text: 'Птенцы',
    sort: true
  }, {
    dataField: 'nest',
    text: 'Гнёзда',
    sort: true
  }, {
    dataField: 'colony',
    text: 'Колония (гнёзда)',
    sort: true
  }];

const columns_acc = [
    {
      dataField: 'date',
      text: 'Дата, время',
      sort: true
    },
    {
      dataField: 'point_id',
      text: 'Point ID',
      //hidden: true
    }, {
      dataField: 'lat',
      text: 'Широта',
      sort: true
    }, {
      dataField: 'lon',
      text: 'Долгота',
      sort: true
    },  {
      dataField: 'order',
      text: 'Отряд',
      sort: true
    }, {
      dataField: 'species',
      text: 'Вид',
      sort: true
    }, {
      dataField: 'sp_num',
      text: 'Количество особей',
      sort: true
    }];

const columns_dist = [
      {
        dataField: 'date',
        text: 'Дата, время',
        sort: true
      },
      {
        dataField: 'point_id',
        text: 'Point ID',
        //hidden: true
      }, {
        dataField: 'lat',
        text: 'Широта',
        sort: true
      }, {
        dataField: 'lon',
        text: 'Долгота',
        sort: true
      },  {
        dataField: 'description',
        text: 'Фактор беспокойства',
        sort: true
      }];


const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


registerLocale('ru', ru);

/*const customTotal = (from, to, size) => (
  <span className='react-bootstrap-table-pagination-total'>
    Showing {from} to {to} of {size} results
  </span>
);*/


const speciesData = [];
const speciesData2 = [];

class Download extends React.Component {

  render() {
    return (
      
        (this.props.f_name === 'birds') ?
        <ExcelFile element={<button>Выгрузить в Excel</button>}>
        <ExcelSheet data={this.props.f_data} name='Birds'>
          {
            columns_main.map(c =>
              <ExcelColumn label={c.text} value={c.dataField} />)
          }
        </ExcelSheet>
        </ExcelFile>
        : (this.props.f_name === 'accompanied') ?
        <ExcelFile element={<button>Выгрузить в Excel</button>}>
        <ExcelSheet data={this.props.f_data} name='Accompanied counts'>
          {
            columns_acc.map(c =>
              <ExcelColumn label={c.text} value={c.dataField} />)
          }
        </ExcelSheet>
        </ExcelFile>
        : (this.props.f_name === 'disturbance') ?
        <ExcelFile element={<button>Выгрузить в Excel</button>}>
        <ExcelSheet data={this.props.f_data} name='Disturbance'>
          {
            columns_dist.map(c =>
              <ExcelColumn label={c.text} value={c.dataField} />)
          }
        </ExcelSheet>
        </ExcelFile>
        : null
      
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate1: new Date('2010-01-01'),
      startDate2: new Date(),
      species: null,
      species2: null,
      markerId: null,
      markerFlag: false,
      selectedOption: ['sp_num'],
      error: null,
      isLoaded: false,
      items: [],
      items2: [],
      items3: [],
      flagAcc: false,
      flagDist: false,
      mapLang: 'ru_RU',
      isHybrid: false
    };
    
  }

  handleChange1 = date => {
    this.setState({ startDate1: date });
  }
  handleChange2 = date => {
    this.setState({ startDate2: date });
  }

  setId(arr) {
    arr.forEach((e, i) => {e.point_id = i; });
    return arr;
  }

  filter_data(data) {
    return data.filter(i =>
      (!this.state.species 
        || this.state.species.value === -1 
        || i.species === this.state.species.label.slice(0,this.state.species.label.indexOf('|')-1)) &&
      (new Date(i.date) >= this.state.startDate1
        && new Date(i.date) <= this.state.startDate2)
    );
  }

  filter_data2(data) {
    return data.filter(i =>
      (!this.state.species2 
        || this.state.species2.value === -1 
        || i.species === this.state.species2.label.slice(0,this.state.species2.label.indexOf('|')-1)) &&
      (new Date(i.date) >= this.state.startDate1
        && new Date(i.date) <= this.state.startDate2)
    );
  }

  handleChangeSp = sp => {
    this.setState({ species: sp })
  }

  handleChangeSp2 = sp => {
    this.setState({ species2: sp })
  }

  handleClickMarker(m) {
    this.setState((prevState) => ({ markerId: m, markerFlag: prevState.markerId === m ? !this.state.markerFlag : true }));
  }

  handleClickMarker2 = m => {
    this.setState({markerId: m});
  }

  handleClickRow = {
    onClick: (e, row, rowIndex) => {
      this.setState(
        (prevState) => 
        ({ markerId: row.point_id, markerFlag: prevState.markerId === row.point_id ? !this.state.markerFlag : true })
        );
    }
  }

  handleOptionChange = e => {
    if (e.target.checked) {
      this.setState({ selectedOption: this.state.selectedOption.concat(e.target.value) })
    } else {
      this.setState({ selectedOption: this.state.selectedOption.filter(obj => obj !== e.target.value) })
    }
  }

  handleOptionChange2 = e => {
    this.setState({ flagAcc: !this.state.flagAcc })
  }

  handleOptionChange3 = e => {
    this.setState({ flagDist: !this.state.flagDist })
  }

  handleHybridChange = e => {
    this.setState({ isHybrid: !this.state.isHybrid })
  }

  setMarkerRadius(sp, pull, nest, col) {
    if (this.state.selectedOption === "sp_num" && sp) {
      if (sp > 0 && sp <= 10) {
        return 3;
      } else if (sp > 10 && sp <= 100) {
        return 5;
      } else if (sp > 100) {
        return 10;
      }
    } else if (this.state.selectedOption === "pull" && pull) {
      /*if (pull > 0 && pull <= 4) {
        return 3;
      } else if (pull > 4 && pull <= 10) {
        return 5;
      } else if (pull > 10) {
        return 10;
      }*/ return 5;
    } else if (this.state.selectedOption === "nest" && nest) {
      /*if (nest > 0 && nest <= 1) {
        return 3;
      } else if (nest > 1 && nest <= 3) {
        return 5;
      } else if (nest > 4) {
        return 10;
      } */ return 3;
    } else if (this.state.selectedOption === "colony" && col) {
      /*if (col > 0 && col <= 10) {
        return 3;
      } else if (col > 10 && col <= 100) {
        return 5;
      } else if (col > 100) {
        return 10;
      }*/ return 5;
    }
  }

  setMarkerColor(n) {
    //if (n === this.state.markerId && this.state.markerFlag) {
      //return 'yellow'
    //} else {
      if (this.state.selectedOption === "sp_num") {
        return 'islands#redCircleDotIcon'
      } else if (this.state.selectedOption === "pull") {
        return 'islands#darkOrangeCircleDotIcon'
      } else if (this.state.selectedOption === "nest") {
        return 'islands#blueCircleDotIcon'
      } else if (this.state.selectedOption === "colony") {
        return 'islands#nightCircleDotIcon'
      }
    //}
  }

  

  componentDidMount() {
    fetch("https://salty-peak-61402.herokuapp.com/db1")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          items: this.setId(result.results)
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );

    fetch("https://salty-peak-61402.herokuapp.com/db2")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          items2: this.setId(result.results)
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );

    fetch("https://salty-peak-61402.herokuapp.com/db3")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          items3: this.setId(result.results)
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );

   
  }

  render() {

    const { error, isLoaded, items, items2, items3 } = this.state;

    const filtered_data = this.filter_data(items);
    const filtered_data2 = this.filter_data2(items2);
        
    // массив для заполнения поля фильтрации основной таблицы
    for (let i = 0; i < items.length; i++) {
      if (speciesData.find(e => e.species === items[i].species) === undefined) {
        speciesData.push(items[i])
      } 
    };
    this.speciesList = speciesData
    .sort((a,b) => a.order_num-b.order_num)
    .map((value, i) => ({ label: `${value.species} | ${value.lat_name} | ${value.eng_name}`, value: i }));
    this.speciesList.unshift({ label: 'Все', value: -1 });

    // массив для заполнения поля фильтрации сопутствующих учётов
    for (let i = 0; i < items2.length; i++) {
      if (speciesData2.find(e => e.species === items2[i].species) === undefined) {
        speciesData2.push(items2[i])
      } 
    };
    this.speciesList2 = speciesData2
    .sort((a,b) => a.order_num-b.order_num)
    .map((value, i) => ({ label: `${value.species} | ${value.lat_name} | ${value.eng_name}`, value: i }));
    this.speciesList2.unshift({ label: 'Все', value: -1 });
    

    const page_options = {
      sizePerPageList: [{ text: '10', value: 10 }, { text: '25', value: 25 }, { text: 'Все', value: filtered_data.length }],
      hidePageListOnlyOnePage: true,
      showTotal: true,
      //paginationTotalRenderer: (from, to, size) => {}
    };

       
    const rowStyleMarker = (row) => {
      const style = {};
      if (row.point_id === this.state.markerId && this.state.markerFlag) {
        style.backgroundColor = 'yellow';
      } else {
        style.backgroundColor = 'white';
      }
      return style;
    }

    if (error) {
      return <div>Ошибка: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Загрузка...</div>;
    } else {
      return (
    
      /*<div title="Hello from React webpack" className={s.app_wrapper}>
          Hello from React webpack!
      </div>*/

      <div>
<div>{this.state.markerId}</div>
        <div className={s.header}>
          <div className={s.line}> Гусеобразные, вид: <Select
            value={this.state.species}
            options={this.speciesList}
            onChange={this.handleChangeSp} />
          </div>

          


          <div className={s.calendar}>Период, с: <DatePicker
            selected={this.state.startDate1}
            onChange={this.handleChange1}
            dateFormat="dd/MM/yyyy"
            locale='ru'
          /> по: <DatePicker
              selected={this.state.startDate2}
              onChange={this.handleChange2}
              dateFormat="dd/MM/yyyy"
              locale='ru'
            /></div>

          <div className={s.checkbox}>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="sp"
                  value="sp_num"
                  checked={this.state.selectedOption.includes("sp_num")}
                  onChange={this.handleOptionChange}
                />
                Особи
          </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="pu"
                  value="pull"
                  checked={this.state.selectedOption.includes("pull")}
                  onChange={this.handleOptionChange}
                />
                Птенцы
          </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="ne"
                  value="nest"
                  checked={this.state.selectedOption.includes("nest")}
                  onChange={this.handleOptionChange}
                />
                Гнёзда
          </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="co"
                  value="colony"
                  checked={this.state.selectedOption.includes("colony")}
                  onChange={this.handleOptionChange}
                />
                Колонии
          </label>
            </div>
          </div>  </div>

          <div>
              <label>
                <input
                  type="checkbox"
                  name="acc"
                  value="accompanied"
                  checked={this.state.flagAcc}
                  onChange={this.handleOptionChange2}
                />
                Сопутствующие учёты
          </label>
            </div>

            {this.state.flagAcc ? 
          <div className={s.line}> Сопутствующие учёты, вид: 
          <Select
          value={this.state.species2}
          options={this.speciesList2}
          onChange={this.handleChangeSp2} 
          />
          </div>
        : null}

            <div>
              <label>
                <input
                  type="checkbox"
                  name="dist"
                  value="disturbance"
                  checked={this.state.flagDist}
                  onChange={this.handleOptionChange3}
                />
                Фактор беспокойства
          </label>
            </div>


        
        <YandexMap main_counts={filtered_data} acc_counts={filtered_data2} disturbance={items3} 
        flagAcc={this.state.flagAcc} flagDist={this.state.flagDist} selectedOption={this.state.selectedOption}
        mapLang={this.state.mapLang} handleClickMarker={this.handleClickMarker2} pointId={this.state.markerId}/>

        

        <div>
        <Tabs defaultActiveKey="main_counts" id="tables">
        <Tab eventKey="main_counts" title="Гусеобразные">

        <BootstrapTable
          keyField='point_id'
          columns={columns_main}
          data={filtered_data}
          bootstrap4
          striped
          hover
          condensed
          pagination={paginationFactory(page_options)}
          rowStyle={rowStyleMarker}
          rowEvents={this.handleClickRow}
        />

        <Download f_data={filtered_data} f_name='birds'/>

        </Tab>

        {this.state.flagAcc ? 
        <Tab eventKey="acc_counts" title="Сопутствующие учёты">
        <div>

          <BootstrapTable
          keyField='point_id'
          columns={columns_acc}
          data={filtered_data2}
          bootstrap4
          striped
          hover
          condensed
          pagination={paginationFactory(page_options)}
          //rowStyle={rowStyleMarker}
          //rowEvents={this.handleClickRow}
          />

         <Download f_data={filtered_data2} f_name='accompanied' />

        </div> 
        </Tab>
        : null}

        {this.state.flagDist ?
        <Tab eventKey="disturbance" title="Фактор беспокойства">
        <div>
          <BootstrapTable
          keyField='point_id'
          columns={columns_dist}
          data={items3}
          bootstrap4
          striped
          hover
          condensed
          pagination={paginationFactory(page_options)}
          //rowStyle={rowStyleMarker}
          //rowEvents={this.handleClickRow}
          />

          <Download f_data={items3} f_name='disturbance' />

        </div>
        </Tab>
        : null}

        </Tabs>
        </div>


  
    

      </div>

)
};
  }
}

export default hot(App);

/*function Square(props) {
  return (
      <button
      className="square"
      onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

  
<div>

            <div>
              <label>
                <input
                  type="checkbox"
                  name="hyb"
                  value="hybrid"
                  checked={this.state.isHybrid}
                  onChange={this.handleHybridChange}
                />
                Спутник
          </label>
            </div>


<Map center={map_center} zoom={4} className={s.box} maxZoom={18}>
          <TileLayer
            url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />

          {filtered_data.map(c => {
            if ((this.state.selectedOption === "sp_num" && c.sp_num)
              || (this.state.selectedOption === "pull" && c.pull)
              || (this.state.selectedOption === "nest" && c.nest)
              || (this.state.selectedOption === "colony" && c.colony)) {
              return <CircleMarker center={[c.lat, c.lon]}
                color={this.setMarkerColor(c.point_id)}
                radius={this.setMarkerRadius(c.sp_num, c.pull, c.nest, c.colony)}
                onClick={() => this.handleClickMarker(c.point_id)}>
                <Popup>
                  Вид: {c.species}<br />
                  Дата: {c.date}<br />
                  Количество особей: {c.sp_num}<br />
                  {c.pull ? 'Птенцы: ' + c.pull + '<br />' : ''}
                  {c.nest ? 'Гнёзда: ' + c.nest + '<br />' : ''}
                  {c.colony ? 'Колония (гнёзда): ' + c.colony + '<br />' : ''}
                </Popup>
              </CircleMarker>
            }
          })}
        </Map>

        

        <YMaps>
            <div>
              <Map className={s.box} defaultState={{ center: map_center, zoom: 4 }}>

              <Circle
      geometry={[map_center, 10000]}
      options={{
        draggable: true,
        fillColor: '#DB709377',
        strokeColor: '#990066',
        strokeOpacity: 0.8,
        strokeWidth: 2,
      }}
          />
              </Map>
                
            </div>
          </YMaps>

        <button
        onClick={this.handleClickButton} > Фактор беспокойства
        </button>
        </div>

        


class Board extends Component {

  renderSquare(i) {
    return (<Square value={this.props.squares[i]}
    onClick={() => this.props.onClick(i)} />);
  }

  

  render ()  {
    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(
      0, this.state.stepNumber+1
    );
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({history: history.concat([{squares: squares,}]),
    stepNumber: history.length,
    xIsNext: !this.state.xIsNext,});
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move :
      'Go to the start';
      return (
        <li key={move}>
          <button onClick={()=>this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'The winner is ' + winner;
    } else {
      status = 'Next player: ' +
      (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares}
          onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ]
  for (let i=0; i<lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b]
      && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}*/

/*ReactDOM.render (
  <Game />,
  document.getElementById('root')
);*/

