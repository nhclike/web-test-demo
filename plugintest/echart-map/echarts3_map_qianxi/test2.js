$(function () {
  var loginChart  = echarts.init(document.getElementById('loginMap'));
  var pointData = [
    {name:'南京',value:''},
    {name:'徐州',value:''},
    {name:'南通',value:''},
    {name:'淮安',value:''},
    {name:'苏州',value:''},
    {name:'宿迁',value:''},
    {name:'连云港',value:''},
    {name:'扬州',value:''},
    {name:'泰州',value:''},
    {name:'无锡',value:''},
    {name:'镇江',value:''},
    {name:'常州',value:''},
    {name:'盐城',value:''}
  ];
  var geoCoordMap = {
    '徐州': [117.5208,34.4268],
    '南京': [118.8062,31.9208],
    '南通': [121.1023,32.1625],
    '淮安': [118.927,33.4039],
    '苏州': [120.6519,31.3989],
    '宿迁': [118.5535,33.7775],
    '连云港': [119.1248,34.552],
    '扬州': [119.4653,32.8162],
    '泰州': [120.0586,32.5525],
    '无锡': [120.3442,31.5527],
    '常州': [119.4543,31.5582],
    '镇江': [119.4763,31.9702],
    '盐城': [120.2234,33.5577]
  };
  var fromName = '南京';
  var linesData = {

    'normal':[
      {"fromName":"徐州","toName":"南京",'coords':[[117.5208,34.4268],[118.8062,31.9208]]},
      {"fromName":"南通","toName":"南京",'coords':[[121.1023,32.1625],[118.8062,31.9208]]},
      {"fromName":"淮安","toName":"南京",'coords':[[118.927,33.4039],[118.8062,31.9208]]},
      {"fromName":"苏州","toName":"南京",'coords':[[120.6519,31.3989],[118.8062,31.9208]]},
      {"fromName":"宿迁","toName":"南京",'coords':[[118.5535,33.7775],[118.8062,31.9208]]},
      {"fromName":"连云港","toName":"南京",'coords':[[119.1248,34.552],[118.8062,31.9208]]},
      {"fromName":"扬州","toName":"南京",'coords':[[119.4653,32.8162],[118.8062,31.9208]]},
      {"fromName":"泰州","toName":"南京",'coords':[[120.0586,32.5525],[118.8062,31.9208]]},
      {"fromName":"无锡","toName":"南京",'coords':[[120.3442,31.5527],[118.8062,31.9208]]},
      {"fromName":"常州","toName":"南京",'coords':[[119.4543,31.5582],[118.8062,31.9208]]},
      {"fromName":"镇江","toName":"南京",'coords':[[119.4763,31.9702],[118.8062,31.9208]]},
      {"fromName":"盐城","toName":"南京",'coords':[[120.2234,33.5577],[118.8062,31.9208]]}
    ],
    'warning':[

    ]
  };

  var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var geoCoord = geoCoordMap[data[i].name];
      if (geoCoord) {
        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i].value)
        });
      }
    }
    return res;
  };

  $.getJSON( '../china-main-city/320000.json',
    function(data) {
      if (data) {
        echarts.registerMap('江苏', data);
        var option = {
          color: ['gold'],
          title : {
            text: '',
            subtext:''
          },
          tooltip : {
            trigger: 'item',
            formatter: function(v) {

            }
          },
          legend: {
            orient: 'vertical',
            x:'left',
            selectedMode: 'single',
            selected:{},
            textStyle : {color: '#fff' },
            data: []
          },
          visualMap: {
            show: false,
            calculable: true,
            inRange: {
              color: ['#83fc7e']
            }
          },
          geo: {
            map: '江苏',
            zoom: 1.3,
            label: {
              normal: {
                show: true,
                color: '#fff'
              },
              emphasis: {
                show: false,
                color: '#fff'
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: 'rgba(100,149,237,0)',
                borderColor: '#fff',
                opacity: 0.2
              },
              emphasis: {
                areaColor: ''
              }
            }
          },
          series : [{
            name: '南京',
            type: 'lines',
            zlevel: 2,
            trailLength: 0.5,
            effect: {
              show: true,
              period: 2,
              symbolSize: 8,
              shadowColor: 'white',
              color:'#fff'
            },
            lineStyle: {
              normal: {
                type: 'dotted',
                borderWidth:1,
                color:'#83fc7e',
                curveness: 0.3
              }
            },
            data: linesData.normal
          },{
            name: '散点',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(pointData),
            symbolSize: 10,
            showEffectOn: 'render',
            rippleEffect: {
              period: 6,
              scale: 5,
              brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: '#83fc7e',
                shadowBlur: 20,
                shadowColor: '#83fc7e'
              }
            }
          },
            {
              name: '江苏',
              type: 'map',
              roam: false,
              hoverable: false,
              mapType: '江苏',
              geoIndex: 0,
              data:[]
            }
          ]
        };
        loginChart.setOption(option);

      } else {
        alert('无法加载该地图');
      }
    });
})