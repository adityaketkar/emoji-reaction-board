import React from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  PieChart, Pie, Cell,
} from 'recharts';
import {Label} from 'recharts';

const COLORS = [  '#00C49F','#FF8042', '#FFBB28',,'#0088FE'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, name,
}) => {
   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <div>
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {name}<br></br>
      </text>
    </div>
  );
};




function copyStyles(sourceDoc, targetDoc) {
  Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
    if (styleSheet.cssRules) { // true for inline styles
      const newStyleEl = sourceDoc.createElement('style');

      Array.from(styleSheet.cssRules).forEach(cssRule => {
        newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
      });

      targetDoc.head.appendChild(newStyleEl);
    } else if (styleSheet.href) { // true for stylesheets loaded from a URL
      const newLinkEl = sourceDoc.createElement('link');

      newLinkEl.rel = 'stylesheet';
      newLinkEl.href = styleSheet.href;
      targetDoc.head.appendChild(newLinkEl);
    }
  });
}


class MyWindowPortal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.containerEl = document.createElement('div'); // STEP 1: create an empty div
    this.externalWindow = null;
  }

  componentDidMount() {
    // STEP 3: open a new browser window and store a reference to it
    this.externalWindow = window.open('', '', 'width=600,height=400,left=200,top=200');

    // STEP 4: append the container <div> (that has props.children appended to it) to the body of the new window
    this.externalWindow.document.body.appendChild(this.containerEl);
    
    this.externalWindow.document.title = 'A React portal window';
    copyStyles(document, this.externalWindow.document);
    
    // update the state in the parent component if the user closes the 
    // new window
    this.externalWindow.addEventListener('beforeunload', () => {
      this.props.closeWindowPortal();
    });
  }

  componentWillUnmount() {
    // This will fire when this.state.showWindowPortal in the parent component becomes false
    // So we tidy up by just closing the window
    this.externalWindow.close();
  }
  
  render() {
    // STEP 2: append props.children to the container <div> that isn't mounted anywhere yet
    return ReactDOM.createPortal(this.props.children, this.containerEl);
  }
}

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    
    this.state = {
      counter: 8,
      showWindowPortal: false,
      dataPie : [
        { name: 'Yes', value: 5 },
        { name: 'No', value: 6 },
        { name: 'Did\'nt Respond', value: 1 },
      ],
      dataBar : [
        {
          name: 'Got It!', uv: 12, pv: 12, StudentStatus: 5,
        },
        {
          name: 'Some Doubts', uv: 12, pv: 12, StudentStatus: 5,
        },
        {
          name: 'Bouncer', uv: 12, pv: 12, StudentStatus: 2,
        }
      ]
    };
    
    this.toggleWindowPortal = this.toggleWindowPortal.bind(this);
    this.closeWindowPortal = this.closeWindowPortal.bind(this);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', () => {
      this.closeWindowPortal();
    });
    
    // window.setInterval(() => {
    //   this.setState(state => ({
    //     counter: state.counter + 1,
    //   }));
    // }, 1000);
  }
  
  toggleWindowPortal() {
    this.setState(state => ({
      ...state,
      showWindowPortal: !state.showWindowPortal,
    }));
  }
  
  closeWindowPortal() {
    this.setState({ showWindowPortal: false })
  }

  randomizeData(){
    console.log("called randomize");
    let seed = Math.floor((Math.random() * 12));
    const newDataPie = [
      { name: 'Yes', value:  seed},
      { name: 'No', value: 11-seed },
      { name: 'Did\'nt Respond', value: 1 },
    ];

    const newDataBar = 
    [
      {
        name: 'Got It!', uv: 12, pv: 12, StudentStatus: seed,
      },
      {
        name: 'Some Doubts', uv: 12, pv: 12, StudentStatus: 10-seed,
      },
      {
        name: 'Bouncer', uv: 12, pv: 12, StudentStatus: 2,
      }
    ];
    this.setState({
      dataBar: newDataBar,
      dataPie: newDataPie
    });
  }
  
  render() {
    return (
      <div className="master-container">
        
        <div className="dashboard">
          <div className="reaction-board">
            <div className="grid-container">
              <div className="grid-item">1</div>
              <div className="grid-item">2</div>
              <div className="grid-item">3</div>
              <div className="grid-item">4</div>
              <div className="grid-item">5</div>
              <div className="grid-item">6</div>
              <div className="grid-item">7</div>
              <div className="grid-item">8</div>
              <div className="grid-item">9</div>
              <div className="grid-item">10</div>
              <div className="grid-item">11</div>
              <div className="grid-item">12</div>
            </div> 
          </div>
          <div className="analytics-board">
              <div className="class-mood">
                <BarChart
                  style={{border:"0.2px solid skyblue",alignContent:"center", justifyContent:"center"}}
                  width={400}
                  height={300}
                  data={this.state.dataBar}
                  barSize={25}
                >
                  <XAxis  dataKey="name" scale="point" padding={{ left: 40 , right: 40 }} dy={10}/>
                  <YAxis /> 
                  <Tooltip />
                  <Legend />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Bar style={{alignContent:"center", justifyContent:"center"}} dataKey="StudentStatus" fill="#8884d8" background={{ fill: '#eee' }}  />
                </BarChart>
              </div>
              <div className="class-responses">
              <PieChart style={{border:"1px solid pink"}} width={400} height={300}>
                <Pie 
                style={{margin:"auto", border:"10px solid black"}}
                data={this.state.dataPie}
                dataKey="value"
                cx={200}
                cy={150} 
                innerRadius={60}
                outerRadius={70} 
                fill="#8884d8"
                paddingAngle={2}
                >
                <Label 
                value={Math.floor((this.state.dataPie[0].value/11)*100) + "%"} position="centerBottom"  className='label-top' fontSize='27px'
                />
                <Label 
                value="Yes responses" position="centerTop" className='label'
                />
                  {
                    this.state.dataPie.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                  }
                </Pie>
                <Tooltip/>
              </PieChart>
              <p>Timer: {this.state.counter}</p>
              </div> 
          </div>
        </div>

        <button onClick={this.toggleWindowPortal}>
          {this.state.showWindowPortal ? 'Close the' : 'Open a'} Student Portal
        </button>

        <button onClick={() => this.randomizeData()}>
            Randomize Data
        </button>
        
        {this.state.showWindowPortal && (
          <MyWindowPortal closeWindowPortal={this.closeWindowPortal} >

            <div className="animation">
              CURRENT MODE ANIMATION 
            </div>

            <div className="section-container">
              <h2 className="section">Modes</h2>
              <div className="actions">
                <button onClick={() => this.closeWindowPortal()} >
                  I don't understand
                </button>
                <button onClick={() => this.closeWindowPortal()} >
                  Got it!
                </button>
                <button onClick={() => this.closeWindowPortal()} >
                  I have a question
                </button>
              </div>
            </div>

            <br></br>
            
            <div className="section-container">
              <h2 className="section">Responses</h2>
              <div className="actions">
              <button onClick={() => this.closeWindowPortal()} >
                Yes
              </button>
              
              <button onClick={() => this.closeWindowPortal()} >
                No
              </button>
              </div>
            </div>
          </MyWindowPortal>
        )}
      </div>
    );
  }
}

export default App;