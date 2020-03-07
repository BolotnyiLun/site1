import React, { PureComponent } from 'react';
import * as s from './App.css';
import { YMaps, Map, Circle, ZoomControl, ObjectManager } from 'react-yandex-maps';

export default class YandexMap extends PureComponent {

    

    createMapPoints(data, flag) {

        let features = [];
        let data_filter = [];
    
        if (flag === 'sp_num' || flag === 'acc') {
          data_filter = data.filter(obj => obj.sp_num)
        } else
        if (flag === 'pull') {
          data_filter = data.filter(obj => obj.pull)
        }
        if (flag === 'nest') {
          data_filter = data.filter(obj => obj.nest)
        } else
        if (flag === 'colony') {
          data_filter = data.filter(obj => obj.colony)
        } else
        if (flag === 'disturbance') {
          data_filter = data.filter(obj => obj.description)
        } 
    
        data_filter.map( e => {
            const tmpObj = {
                type: 'Feature',
                id: e.point_id,
                geometry: {
                    type: 'Point',
                    coordinates: [e.lat, e.lon],
                },
                options: {
                  preset: e.point_id === this.props.pointId ? 'islands#yellowCircleDotIcon' : 'islands#greenCircleDotIcon'
                },
                properties: {
                  balloonContent: 
                  (flag === 'sp_num' || flag === 'pull' || flag === 'nest' || flag === 'colony' || flag === 'acc') ?
                  `Вид: ${e.species}<br />
                   Дата: ${e.date}<br />
                   ${e.sp_num ? 'Количество особей: ' + e.sp_num + '<br />' : ''}
                   ${e.pull ? 'Птенцы: ' + e.pull + '<br />' : ''}
                   ${e.nest ? 'Гнёзда: ' + e.nest + '<br />' : ''}
                   ${e.colony ? 'Колония (гнёзда): ' + e.colony + '<br />' : ''}`
                   : (flag === 'disturbance') ?
                   `Фактор беспокойства: ${e.description}<br />
                    Дата: ${e.date}<br />`
                   : null
                }
            };
            return features.push(tmpObj);
          
        })
        return features;
      }

    render() {
        return (
            <YMaps  query={{ lang: this.props.mapLang }}>
          <div>
            <Map className={s.box} defaultState={{ center: [67.0, 78.0], zoom: 4 }}>
              
              <ZoomControl options={{ float: 'right' }} />
              
              {this.props.selectedOption.includes('sp_num') ?
              <ObjectManager
              options={{
                clusterize: true,
                gridSize: 64,
                minClusterSize: 10,
              }}
              objects={{
                openBalloonOnClick: true,
                //preset: 'islands#redCircleDotIcon',
                
              }}
              clusters={{
                preset: 'islands#redClusterIcons',
              }}
              features={this.createMapPoints(this.props.main_counts, 'sp_num')}
              modules={[
                'objectManager.addon.objectsBalloon',
                "objectManager.addon.clustersBalloon"
              ]}
              onClick={e => this.props.handleClickMarker(e.get('objectId'))
              }
              
              
            
              /> : null}
              
              {this.props.selectedOption.includes('pull') ?
              <ObjectManager
              options={{
                clusterize: true,
                gridSize: 64,
                minClusterSize: 10,
              }}
              objects={{
                openBalloonOnClick: true,
                preset: 'islands#darkOrangeCircleDotIcon',
              }}
              clusters={{
                preset: 'islands#darkOrangeClusterIcons',
              }}
              features={this.createMapPoints(this.props.main_counts, 'pull')}
              modules={[
                'objectManager.addon.objectsBalloon',
                "objectManager.addon.clustersBalloon"
              ]}
              /> : null}
              
              {this.props.selectedOption.includes('nest') ?
              <ObjectManager
              options={{
                clusterize: true,
                gridSize: 64,
                minClusterSize: 10,
              }}
              objects={{
                openBalloonOnClick: true,
                preset: 'islands#blueCircleDotIcon',
              }}
              clusters={{
                preset: 'islands#blueClusterIcons',
              }}
              features={this.createMapPoints(this.props.main_counts, 'nest')}
              modules={[
                'objectManager.addon.objectsBalloon',
                "objectManager.addon.clustersBalloon"
              ]}
              /> : null}

              {this.props.selectedOption.includes('colony') ?
              <ObjectManager
              options={{
                clusterize: true,
                gridSize: 64,
                minClusterSize: 10,
              }}
              objects={{
                openBalloonOnClick: true,
                preset: 'islands#nightCircleDotIcon',
              }}
              clusters={{
                preset: 'islands#nightClusterIcons',
              }}
              features={this.createMapPoints(this.props.main_counts, 'colony')}
              modules={[
                'objectManager.addon.objectsBalloon',
                "objectManager.addon.clustersBalloon"
              ]}
              /> : null}

             {this.props.flagAcc ?
              <ObjectManager
              options={{
                clusterize: true,
                gridSize: 64,
                minClusterSize: 10,
              }}
              objects={{
                openBalloonOnClick: true,
                preset: 'islands#yellowCircleDotIcon',
              }}
              clusters={{
                preset: 'islands#yellowClusterIcons',
              }}
              features={this.createMapPoints(this.props.acc_counts, 'acc')}
              modules={[
                'objectManager.addon.objectsBalloon',
                "objectManager.addon.clustersBalloon"
              ]}
              /> : null}

              {this.props.flagDist ?
              <ObjectManager
              options={{
                clusterize: true,
                gridSize: 64,
                minClusterSize: 10,
              }}
              objects={{
                openBalloonOnClick: true,
                preset: 'islands#blackCircleDotIcon',
              }}
              clusters={{
                preset: 'islands#blackClusterIcons',
              }}
              features={this.createMapPoints(this.props.disturbance, 'disturbance')}
              modules={[
                'objectManager.addon.objectsBalloon',
                'objectManager.addon.clustersBalloon',
              ]}
              /> : null}

            </Map>
          </div>
        </YMaps>
        )
    }
}


