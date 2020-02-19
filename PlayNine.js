//test
const Stars = props => {
	// every time react render, new number will get generated
  // move this to the Game component to avoid new number generation
	//const numberOfStars = 1+Math.floor(Math.random() * 9) ;
  
  //let stars = [];
  //for(let i=0; i<numberOfStars; i++){
	//	stars.push(<i key={i} className="fa fa-star"></i>);
  //}

	return (
  		<div className="col-5">
  		  {_.range(props.numberOfStars).map(i =>
        	<i key={i} className="fa fa-star"></i>
        )}
  		</div>
    );
}

const Button = props => {
	let button;
  switch(props.answerIsCorrect){
  	case true:
    	button = 
					<button className="btn btn-success" onClick={props.acceptAnswer} >
          	<i className="fa fa-check"></i>
          </button>
      break;
    case false:
      button = 
					<button className="btn btn-danger" >
          	<i className="fa fa-times"></i>
          </button>
      break;
    default:
      button = 
					<button className="btn" 
          	disabled={props.selectedNumbers.length===0}
          	onClick={props.checkAnswer}> =
          </button>
      break;
  }
	return (
  	<div className="col-2" text-center> 
    	{button}
      <br/><br/>
      <button className="btn btn-warning btn-sm" onClick={props.redraw} disabled={props.life===0}>
        	<i className="fa fa-refresh">{props.life}</i>
      </button>
    </div>
  );
}

const Answer = props => {
	return (
  	<div className="col-5" > 
    	{props.selectedNumbers.map((number, i) =>
      	<span key={i} 	onClick={() => props.unselectNumber(number)}>
        	{number}
        </span>
      )}
    </div>
  );
}

const Numbers = props => {
	// no need to declare arrayOfNumbers everytime 
	//const arrayOfNumbers = _.range(1,9); 
  const numberClassName = (number) => {	
    if(props.usedNumbers.indexOf(number) >= 0){
      return 'used';
    }  	
  	if(props.selectedNumbers.indexOf(number) >= 0){
      return 'selected';
    }  	
  }
	return (
  	<div className="card text-center">
    	<div>
      {Numbers.list.map((number, i) =>
      	<span key={i} className={numberClassName(number)}
        	onClick={() => props.selectNumber(number)}>
        	{number}
        </span>
      )}      	
      </div>
    </div>);
}
Numbers.list = _.range(1,10); // this is being shared

const DoneFrame = props => {
	return (
  	<div className="text-center">
    	<h2>{props.gameOver}</h2>
    </div>
  );
}

var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

class Game extends React.Component {
	static randomNumber = () => 1 + Math.floor(Math.random() * 9);
	state = {
  	selectedNumbers: [],
    usedNumbers: [],
    randomNumberOfStars: Game.randomNumber(),
    answerIsCorrect: null,
    life: 5,
    gameOverStatus: ""
  };
  selectNumber = (clickedNumber) => {
  	//disable reselect selected number
  	if(this.state.selectedNumbers.indexOf(clickedNumber) >= 0 || this.state.usedNumbers.indexOf(clickedNumber) >= 0){
    	return;
    }
  	this.setState(prevState => ({
      answerIsCorrect: null,
    	selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
    }));
  };
  unselectNumber = (clickedNumber) => {
  	this.setState(prevState => ({
      answerIsCorrect: null,
    	selectedNumbers: prevState.selectedNumbers.filter(n => n !== clickedNumber)
    }));
  };
  checkAnswer = () => {
    	this.setState(prevState => ({
        answerIsCorrect: prevState.randomNumberOfStars === prevState.selectedNumbers.reduce((acc,n) => acc+n, 0)
      }));
  };
  acceptAnswer = () => {
  	// userdNumbers
    this.setState(prevState => ({
    	usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      answerIsCorrect: null,
      randomNumberOfStars: Game.randomNumber(),
    }), this.updateGameStatus);
  };
  redraw = () => {
  	if(this.state.life === 0) {return;}
  	this.setState(prevState => ({
    	randomNumberOfStars: Game.randomNumber(),
      answerIsCorrect: null,
      selectedNumbers: [],
      life: prevState.life-1
    }), this.updateGameStatus);
  };
  possibleSolutions = ({randomNumberOfStars, usedNumbers}) => {
  	const possibleNumbers = _.range(1,10).filter(number => usedNumbers.indexOf(number) === -1);
    return possibleCombinationSum(possibleNumbers, randomNumberOfStars);
  };
  updateGameStatus = () => {
  	this.setState(prevState => {
    	if(prevState.usedNumbers.length === 9){
      	return {gameOverStatus: "You Win!"};
      }
      if(prevState.life === 0 && !this.possibleSolutions(prevState)){
      	return {gameOverStatus: "You Lost!"};
      }
    });
  }
  render() {
  	// declare variables 
  	const {
    	selectedNumbers, 
      usedNumbers,
      randomNumberOfStars,
      answerIsCorrect,
      life,
      gameOverStatus
      } = this.state;
    return (
      <div className="container">
        <h3>Play Nine</h3> 
        <hr/>
        <div className="row">
          <Stars numberOfStars={randomNumberOfStars}/>
          <Button selectedNumbers={selectedNumbers} 
                  answerIsCorrect={answerIsCorrect} 
                  checkAnswer={this.checkAnswer}
                  acceptAnswer={this.acceptAnswer}
                  redraw={this.redraw}
                  life={life}/>
          <Answer selectedNumbers={selectedNumbers} unselectNumber={this.unselectNumber} />           
        </div>
        <div>
        <br/>
        {gameOverStatus ? 
          <DoneFrame gameOver={gameOverStatus}/> :
          <Numbers selectedNumbers={selectedNumbers}
          	selectNumber={this.selectNumber}
            usedNumbers={usedNumbers}/>
        }
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <Game />
      </div>
    );
  }
}
ReactDOM.render(<App />, mountNode)
