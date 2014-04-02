var flipSound;
var startSound;
var cardPack = [];
var deck = [];
var currentGame;
var gameMode;
var q;
var turnState;
var gameOver


//single player data
var numTries;
var pairedCards = [];
var P;

//two player data
var playerOne = [];
var playerTwo = []; 
var playerTurn;
var playerOneTurn;
var playerTwoTurn;

function attachEvent(element, type, handler)
{
    if (element.addEventListener) element.addEventListener(type, handler, false);
    else element.attachEvent("on"+type, handler);
}

attachEvent(window,"load",setup);

function newGame()
{
    generateDeck();
    displayDeck();
    if(gameMode > 1)
    {
    	playerTurn = Math.floor(2*Math.random())+1;
    	playerOne[1] = 0;
    	playerTwo[1] = 0;
    	turnState = 0;
    	document.getElementById("playerOneScore").innerHTML = "";
		document.getElementById("playerTwoScore").innerHTML = "";
    	updatePlayer();
    }
    else
    {
    	numTries = 24;
    	document.getElementById("flip-back").innerHTML = "You have " + numTries + " flips!";
    }
    
    pairedCards = [];
    gameOver = 1;
    localStorage.removeItem("savedGame");
    localStorage.removeItem("pairs");
	 document.getElementById("flip-front").innerHTML = "<h1>Memory Card Game</h1>";
}


function loadGame()
{
   var gameData = JSON.parse(localStorage.getItem("savedGame"));
   gameOver = 1;
   numTries = gameData[0];   
	currentGame.innerHTML = gameData[1];
	
	gameMode = gameData[3];
	
	P = gameData[2];
	if(gameMode > 1)
	{
		var temp1 = JSON.parse(localStorage.getItem("playerOne"));
   	var temp2 = JSON.parse(localStorage.getItem("playerTwo"));
   	
   	playerOne[0] = temp1[0];
   	playerTwo[0] = temp2[0];
   	playerOne[1] = temp1[1];
   	playerTwo[1] = temp2[1];
		playerTurn = gameData[4];
		turnState = gameData[5];
		document.getElementById("flip-back").innerHTML = "" + playerOne[0] + " VS " +  playerTwo[0];
		updatePlayer();
	}
	else
	{
		document.getElementById("flip-back").innerHTML = "You have " + numTries + " flips!";
	}
	document.getElementById("flip-front").innerHTML = "<h1>Memory Card Game</h1>";
		
	var temp = currentGame.querySelectorAll(".p");
	for(var i = 0; i < temp.length; i++)
	{
		pairedCards[i] = temp[i];
	}
}

function setup()
{
   currentGame = document.getElementById("game");
       
	applause = document.createElement('audio');
	boo = document.createElement('audio');
	match = document.createElement('audio');
	flipSound = document.createElement('audio');
	startSound = document.createElement('audio');
  
	applause.setAttribute('src', 'static/sound/applause.ogg');
	boo.setAttribute('src', 'static/sound/boo.ogg');
	match.setAttribute('src', 'static/sound/match.ogg');
	flipSound.setAttribute('src', 'static/sound/flip_card.ogg');
	startSound.setAttribute('src', 'static/sound/finish.ogg');
	
	startSound.play();
	
	attachEvent(document.getElementById("saveNameButton"), "click", save);
	attachEvent(document.getElementById("saveGame"), "click", saveGame);
	attachEvent(document.getElementById("saveName"), "click", saveName);
	attachEvent(document.getElementById("newGame"), "click", newGame);
	attachEvent(document.getElementById("cancel"), "click", cancel);
	attachEvent(document.getElementById("singlePlayerB"), "click", setUpSinglePlayerMode );
	attachEvent(document.getElementById("twoPlayerB"), "click", setUpTwoPlayerMode );
	attachEvent(document.getElementById("closeB"), "click", closeMenu);
	attachEvent(document.getElementById("changeGameMode"), "click", changeGameMode);
	attachEvent(document.getElementById("submitMultiName"), "click", savePlayersName);
	attachEvent(document.getElementById("closePlayerNameD"), "click", closePlayerMenu);
	
		
	
	if(localStorage.playerName)
	{ 
    playerName = JSON.parse(localStorage.getItem("playerName"));
    document.getElementById("playerName").innerHTML = "Welcome " + playerName;
    //alert("Welcome back " + playerName + "!"); 
  }else{
      document.getElementById("playerName").innerHTML = "Welcome!!";  
  }
  
  displayGameModeMenu(document.getElementById("gameMode"));
  playerOneTurn = document.getElementById("playerOneTurn");
  playerTwoTurn = document.getElementById("playerTwoTurn");
  
}

function closePlayerMenu()
{
		if(!playerOne[0])
		{
			playerOne[0] = "Player One";
		}
		
		if(!playerTwo[0])
		{
			playerTwo[0] = "Player Two";
		}
				
		document.getElementById("flip-back").innerHTML = "" + playerOne[0] + " VS " +  playerTwo[0];
		saveMPlayerDataToStorage();
		
		hideMenu(document.getElementById("playerNameD"));
		updatePlayer();
}

//saves player name when multiplayer selected
function savePlayersName()
{
		var temp = document.getElementById("playerOneName").value;
		if(temp.length > 1)
		{
			playerOne[0] = temp;
		}
		else
		{
			playerOne[0] = "Player One";
		}
		
		temp = document.getElementById("playerTwoName").value;
		
		if(temp.length > 1)
		{
			playerTwo[0] = temp;
		}
		else
		{
			playerTwo[0] = "Player Two";
		}
				
		document.getElementById("flip-back").innerHTML = "" + playerOne[0] + " VS " +  playerTwo[0];
		saveMPlayerDataToStorage();
		
		hideMenu(document.getElementById("playerNameD"));
		updatePlayer();
		
		//alert("Player One: " + playerOne[0] + "\n Player Two: " + playerTwo[0]);
	}
	
function saveMPlayerDataToStorage()
{
	if(!localStorage.playerOne)
		{
			localStorage.setItem("playerOne", JSON.stringify([playerOne]));
		}
		else
		{
			localStorage.playerOne = JSON.stringify([playerOne]);
		}
		
		if(!localStorage.playerTwo)
		{
			localStorage.setItem("playerTwo", JSON.stringify([playerTwo]));
		}
		else
		{
			localStorage.playerTwo = JSON.stringify([playerTwo]);
		}
}
function closeMenu(){
			hideMenu(document.getElementById("gameMode"));
	}
	
function changeGameMode(){
	
    	displayGameModeMenu(document.getElementById("gameMode"));
    	
    	}
    
function displayGameModeMenu(menu){
	
	menu.style.opacity = "1";
  	menu.style.pointerEvents = "auto"; 
	
	}
	
function hideMenu(menu)
{
		menu.style.opacity = "0";
  		menu.style.pointerEvents = "none"; 
  		}
  		
  		
function setUpSinglePlayerMode()
{
	hideMenu(document.getElementById("gameMode"));	
	document.getElementById("scoreBoard").style.display = "node";
	gameMode = 1;	
	createSinglePlayerGame();
}


function setUpTwoPlayerMode(){
		hideMenu(document.getElementById("gameMode"));
		
		displayGameModeMenu(document.getElementById("playerNameD"));
		gameMode = 2;
		createTwoPlayerGame();
		document.getElementById("scoreBoard").style.display = "inherit";
			
	}
	
	//function check the current game mode whether single player mode or multiplayer
	function isMultiPlayer()
	{
		if(gameMode > 1){return true;}else{return false;}
	}
	
	//creates a two player game
	function createTwoPlayerGame()
	{
		playerOne[1] = 0;
		playerTwo[1] = 0;
		playerTurn = Math.floor(2*Math.random())+1;
		
		
		turnState = 0;
		 
   	if(!localStorage.savedGame)
		{ 
		    newGame(); 
		}
		else
		{ 
	   	 loadGame(); 
		}
		
	}
	
	//creates a single player game
	function createSinglePlayerGame()
	{
		if(!localStorage.savedGame)
		{ 
		    newGame(); 
		}
		else
		{ 
	   	 loadGame(); 
		}
	}
	
//saves player name for single player mode to local storage
function save()
{
	var name = document.getElementById("name");
	document.getElementById("playerName").innerHTML = "Welcome\n  " + name.value;
	if(!localStorage.playerName)
	{
		localStorage.setItem("playerName", JSON.stringify([name.value]));
	}
	else
	{
		localStorage.playerName = JSON.stringify([name.value]);
	}
		$('#subName').animate({marginTop:-80}, 600);
		$('#subName').hide();
		$('#saveName').show();
		$('#saveName').animate({marginTop:-70}, 500);
	
	name.value = "Enter Name...";
}

//cancel saving name
function cancel()
{
	
		$('#subName').animate({marginTop:-80}, 600);
		
		$('#saveName').show();
		$('#saveName').animate({marginTop:-70}, 500);
		$('#subName').hide();
		
		document.getElementById("name").value = "Enter Name...";
}
	
	
//carry out animation for saving a name (single player) 
function saveName()
{		
	$('#saveName').animate({marginTop:-200}, 600);
	$('#saveName').hide();
	$('#subName').show();	
	$('#subName').animate({marginTop:0}, 600);
}

//saves current game to storage 
function saveGame()
{
    var game = document.getElementById("game").innerHTML;
    var flips = numTries;
    var gameData;
    
    if(gameMode > 1)
    {
    	gameData = [0, game, P, 2, playerTurn, turnState];
    	saveMPlayerDataToStorage();
    }
    else
    {
    	gameData = [flips, game, P, 1, 0];
    }
    
	if(!localStorage.savedGame)
	{
		localStorage.setItem("savedGame", JSON.stringify(gameData));
	}
	else
	{
		localStorage.savedGame = JSON.stringify(gameData);
	}
}

//change class name of card 
function changeClassName(e,c)
{
    e.className="w "+c;
}

//change class name of turn display 
function updateClassName(object, cName)
{
    object.className= cName;
}


// get out a random element from an array
function R(a)
{
    return a.splice(0|a.length*Math.random(),1)[0];
}

function announceWinner()
{
	if(playerOne[1] > playerTwo[1])
	{
		document.getElementById("winner").innerHTML = "" + playerOne[0] + " WON!!!";
	}
	else
	{
		document.getElementById("winner").innerHTML = "" + playerTwo[0] + " WON!!!";
	}
}

//rotate the current player when called  
function changePlayer()
{
	if(playerTurn > 1)
	{
		playerTurn = 1;	
	} 
	else
	{
		playerTurn = 2;
	}
	turnState = 0;
	 updatePlayer();
}

//display the player switch to the user
function updatePlayer()
{
	playerTwoTurn.innerHTML = playerTwo[0];
	playerOneTurn.innerHTML = playerOne[0];
	
	if(playerTurn > 1)
		{	
			//document.getElementById("turnArea").innerHTML = playerTwo[0] + " turn!!!";
			updateClassName(playerTwoTurn, "activePlayer");
			updateClassName(playerOneTurn, "inactivePlayer");
		}
		else
		{
			//document.getElementById("turnArea").innerHTML = playerOne[0] + " turn!!!";
			updateClassName(playerOneTurn, "activePlayer");
			updateClassName(playerTwoTurn, "inactivePlayer");
		}
}


function updateScoreBoard()
{
	if(playerTurn > 1)
	{
		playerTwo[1]++;
	}
	else
	{
		playerOne[1]++;
	}
	document.getElementById("playerOneScore").innerHTML = "" + playerOne[0] +" Score: " + playerOne[1];
	document.getElementById("playerTwoScore").innerHTML = "" + playerTwo[0] +" Score: " + playerTwo[1];
	
}


    /*
     * Flip the card
     *
     * We use classes to be able to count some group of cards:
     * "p" is used for "paired" cards that stay visible forever
     * "v" is used for the 1 or 2 cards that we turned on and are currently "visible"
     */
    function Flip(t)
    {
      if((numTries > 0 || gameMode > 1) && gameOver > 0)
		{	
			//check if multiplayer and less than two flips		
			//if(gameMode > 1 && turnState < 2)
			//{
			//	turnState ++;
			//}
			
			var paired = false;
			for(var i = 0; i < pairedCards.length; i++)			
			{
				if(t == pairedCards[i] )
				{
					paired = true;
				}
			}
            
			
			if(!paired)
			{
				//get all visible cards 
				var visibleCards = currentGame.querySelectorAll(".v");
				
				
				var x = visibleCards[0];
				var y = visibleCards[1];
				
				//if no visible card just flip current card (t)
				if(visibleCards.length  == 0)
				{
					flipSound.play();					
					changeClassName(t,"v");
					if(gameMode > 1){turnState++;}
					updateTries();
				}
				//if one visible card present already
				else if(visibleCards.length  == 1)
				{
					if(x != t)
					{
						flipSound.play();
						changeClassName(t,"v");
						
						updateTries();
						if(gameMode > 1){turnState++;}
						if(x.innerHTML == t.innerHTML)
						{
							//if current card match with with visible card player retain turn
							match.play();
							if(gameMode > 1){turnState = 0;updateScoreBoard();}
							changeClassName(x,"p");
							changeClassName(t,"p");
							pairedCards.push(x);
							pairedCards.push(t);
							P--;
						}
					}
					else
					{	
						//if(gameMode > 1){turnState++;}
						changeClassName(x,"");
					}
				
				}
				//checks if two cards already visible
				else if(visibleCards.length  == 2)
				{
					//checks if the card clicked was not a visible card
					if(x != t && y != t)
					{
						flipSound.play();
						changeClassName(t,"v");
						changeClassName(x,"");
						changeClassName(y,"");
						
						updateTries();
					}
					else
					{
						changeClassName(x,"");
						changeClassName(y,"");
					}
					
					if(gameMode > 1){turnState++;}
					
				}
				
				if(gameMode > 1 && turnState > 1){changePlayer();}
				if(!P)
				{
					if(gameMode < 2)
					{
						document.getElementById("flip-front").innerHTML = "<h1>YOU HAVE WON!</h1>";
					}
					else
					{
						announceWinner();
					}
					gameOver = 0;
					applause.play();
				}
					
			}
	}
		else
		{
			if(gameMode < 2){
				document.getElementById("flip-front").innerHTML = "<h1>YOU LOSE!!!!</h1>";
				boo.play();
				}
			
			}
	
}

function updateTries()
{
	if(gameMode < 2){
		numTries--;
		document.getElementById("flip-back").innerHTML = "You have " + numTries + " flips!";
	}
}

function generateDeck()
{
    P=8;
    // Fill in p array that represents the pack of cards.
    q="A234567890JQK".split("");
    var img = ["spade.png", "heart.png", "club.png", "diamond.png"];



    for(var c = 0; c < 4; c++)
    {
        for(i = 0; i < 13; i++)
            cardPack.push( [img[c], q[i] ] );
    }
    // Pull out a card and put it on the deck twice. Those will be the pairs.

    for(i = 0; i < 8; i++)
    {
        deck[i] = deck[i+8] = R(cardPack);
    }
}

function displayDeck()
{

    // start to draw the screen

    var deckArea ='<div style="width:450px">';

    // we need to create 16 cards
    for(var i = 16; i ; i--)
    {
        // take out a random element from the cards on the deck
       var card = R(deck);
        deckArea +='<div class="w" onclick="Flip(this)"> <div class="cardfront"><img id="icon" src="static/img/'+card[0]+'"/><div id="cardNum">'
            +card[1]+'</div><img id="icon2" src="static/img/'+card[0]+'"/></div><div class="cardback"><img id="cardlogo" src="static/img/cardback.png" /></div></div>'
    }
    // add it to the DOM
	
    currentGame.innerHTML = deckArea +'</div>';

}
