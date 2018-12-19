// Card is component which is a function component
const Card = (props) => {
	return (
  	<div>
    	<img width="75" src={props.avatar_url} />
    	<div style={{display:'inline-block',marginLeft: 10}}>
      	<div style={{fontSize: '1.25em', fontWeight: 'bold'}}> 
        	{props.name}
        </div>
        <div> {props.company} </div>
      </div>
    </div>
    );
}

let data = [
  {
    name: "Bao Do", 
    avatar_url:"https://avatars0.githubusercontent.com/u/10984895?v=4",	
    company:"GMR"
  },
  {
  name: "David Leal",
  avatar_url:"https://avatars1.githubusercontent.com/u/293?v=4",
  companay: "Mojo Tech"
  }
]

// map data cards objects to component Card
// ... spread operation, allow data to be pass to Card
const Cardlist = (props) => {
	return (
  	<div>
      {props.cards.map(card => <Card key={card.id} {...card} />)}
    </div>
  );
}

class Form extends React.Component{
	state = { userName: ''}
	handleSubmit = event => {
  	event.preventDefault();
    //console.log('Event: Form Submit', this.state.userName);
    axios.get('https://api.github.com/users/'+this.state.userName).then(reps => {
      this.props.onSubmit(reps.data);
      this.setState({userName: ''});
    }).catch((error) => console.log(error));      
  };
	render() {
  	return (
    	<form onSubmit={this.handleSubmit}>
      	<input type="text"
        	value={this.state.userName}
        	onChange={(event) => this.setState({ userName: event.target.value})}
        	//ref={(input) => this.userNameInput = input }
          placeholder="github username" required />
        <button type="submit"> Add Card </button>
      </form>
    );
  }
}

class App extends React.Component {
	state = {
  	cards: []
  };
  addNewCard = cardInfo => {
  	this.setState(prevState => ({
    	cards: prevState.cards.concat(cardInfo)
    }));
  }
	render () {
  	return (
    	<div>
      	<Form onSubmit={this.addNewCard} />
        <Cardlist cards={this.state.cards}/>
      </div>
      );
  }
}

ReactDOM.render(<App />, mountNode)
